
"""
Tasks module
"""
import os
from celery import task
from vpnserver import logs_path
from vpnserver.models import ConfigNetwork, ConfigVpn, ConfigRouting, ConfigLogs
from vpnserver.helpers import set_taskstatus_finished
from pkiapi import init_pki, pki_methods, executables_path, config_methods


@task()
def setnewpki(common_name, pkey_type):

    exec_paths = executables_path.EXEC_PATHS
    sudo_mode = True
    init_pki.init_folder_structure(sudo_mode)

    # ca
    pki_methods.create_serial(exec_paths.PKI_SERIAL_FILE, exec_paths.OPENSSL, sudo_mode)

    pki_methods.generate_req(
        pkey_type,
        exec_paths.PKI_CA_REQ,
        exec_paths.PKI_CA_KEY,
        exec_paths.OPENSSL,
        common_name,
        sudo_mode
    )

    pki_methods.sign_req(
        exec_paths.PKI_CA_REQ,
        exec_paths.PKI_CA_CERT,
        exec_paths.PKI_CA_KEY,
        exec_paths.OPENSSL,
        sudo_mode
    )
    pki_methods.gen_diffie_hellman(exec_paths.PKI_DH_FILE, exec_paths.OPENSSL, sudo_mode)
    pki_methods.gen_tls_key(exec_paths.OPENVPN_BIN, exec_paths.PKI_TA_KEY_FILE, sudo_mode)

    pki_methods.generate_req(
        pkey_type,
        exec_paths.PKI_SERVER_REQ,
        exec_paths.PKI_SERVER_KEY,
        exec_paths.OPENSSL,
        "vpnserver",
        sudo_mode
    )

    pki_methods.sign_req_with_ca(
        exec_paths.PKI_SERVER_REQ,
        exec_paths.PKI_SERVER_CERT,
        "server_exts",
        exec_paths.OPENSSL,
        sudo_mode
    )
    pki_methods.gen_crl(exec_paths.PKI_CRL_FILE, exec_paths.OPENSSL, sudo_mode)


    server_name = None
    server_dns  = None
    server_dns_additional = None
    logs_level = None
    logs_status = False

    if ConfigVpn.objects.exists():
        server_name = ConfigVpn.objects.get(pk=1).server_name

    if ConfigNetwork.objects.exists():
        server_dns = ConfigNetwork.objects.get(pk=1).server_dns1
        server_dns_additional = ConfigNetwork.objects.get(pk=1).server_dns2

    if ConfigLogs.objects.exists():
        logs_level = str(ConfigLogs.objects.get(pk=1).level)
        logs_status = ConfigLogs.objects.get(pk=1).is_enabled
    #routing table
    routing_table = ConfigRouting.objects.all()

    setnewvpn(
        pkey_type,
        server_name,
        server_dns,
        server_dns_additional,
        routing_table,
        logs_level,
        logs_status
    )

    try:
        set_taskstatus_finished()
    except: #pylint: disable=bare-except
        print("---PKI generation has failed")

    os.system('sudo systemctl restart openvpn@openvpn')


def setnewvpn(pkey_type, server_name, server_dns, server_dns_additional, routing_table,
              verb_level='3', logs_status=False):

    exec_paths = executables_path.EXEC_PATHS

    os.system("sudo chown -R ubuntu:ubuntu %s" % exec_paths.VPN_FOLDER)

    server_vpn_config = config_methods.create_server_config(
        pkey_type,
        server_name,
        exec_paths.PKI_CA_CERT,
        exec_paths.PKI_SERVER_CERT,
        exec_paths.PKI_SERVER_KEY,
        exec_paths.PKI_DH_FILE,
        exec_paths.PKI_TA_KEY_FILE,
        exec_paths.PKI_CRL_FILE,
        server_dns,
        routing_table,
        server_dns_additional,
        verb_level,
        logs_status
    )
    log_path = logs_path.LOGS_PATH.LOG_FILE_PATH
    log_dir = logs_path.LOGS_PATH.LOGS_DIR
    # Создаем директорию где будут храниться логи
    if logs_status and not os.path.isdir(log_dir):
        os.system("sudo mkdir %s" % log_dir)

    # Создаем конфигурационный файл для logrotate
    create_logrotate_config(logs_status)

    with open(exec_paths.VPN_CONFIG, 'w') as file:
        file.write(server_vpn_config)

    if os.name != 'nt':
        os.system('sudo iptables -t nat -A POSTROUTING -s %s/24 -o eth0 -j MASQUERADE' %
            server_name
        )
        os.system('sudo iptables-save')
        os.system('sudo sh -c "iptables-save > /etc/iptables.rules"')
        os.system('sudo systemctl restart openvpn@openvpn')
        os.system("sudo chown -R root:root %s" % exec_paths.VPN_FOLDER)

    # Разрешаем чтение лог-файла
    if logs_status:
        if os.path.isfile(log_path):
            os.system('sudo chmod o+r %s' % log_path)


def set_new_ip():
    config = ConfigNetwork.objects.get(pk=1)

    server_ip = config.server_ip
    server_mask = config.server_mask
    server_gate = config.server_gate
    server_dns1 = config.server_dns1
    server_dns2 = config.server_dns2

    #pylint: disable=line-too-long
    command = 'sudo echo -e "auto lo \niface lo inet loopback\n' \
              '\n#the primary network interface\nallow-hotplug eth0\niface eth0 inet static\naddress %s' \
              '\nnetmask %s\ngateway %s\ndns-nameservers %s %s\npre-up iptables-restore < /etc/iptables.rules" > inet &&' \
              ' sudo cp inet /etc/network/interfaces && ' \
              'sudo ifdown eth0 && sudo ip addr flush dev eth0 && sudo ifup eth0' % (
                server_ip, server_mask, server_gate, server_dns1, server_dns2
            )
    os.system(command)
    # check time
    os.system("sudo ntpdate 0.ru.pool.ntp.org")

    return None



# Создаем конфигурационный файл для logrotate
def create_logrotate_config(status):

    logs_file = logs_path.LOGS_PATH.LOG_FILE_PATH
    logrotate_file = logs_path.LOGS_PATH.LOGRORATE_FILE_PATH

    logrotate_config = []

    if status:
        logrotate_config.append(logs_file)
        logrotate_config.append(' ')
        logrotate_config.append('{\n')
        logrotate_config.append('  daily\n')
        logrotate_config.append('  notifempty\n')
        logrotate_config.append('  missingok\n')
        logrotate_config.append('  copytruncate\n')
        logrotate_config.append('  compress\n')
        logrotate_config.append('  rotate 90\n')
        logrotate_config.append('  maxage 90\n')
        logrotate_config.append('  dateext\n')
        logrotate_config.append('  dateyesterday\n')
        logrotate_config.append('  dateformat-%Y-%m-%d\n')
        logrotate_config.append('}\n')

    if not os.path.isfile(logrotate_file):
        os.system("sudo touch %s" % logrotate_file)
    os.system("sudo chown ubuntu:ubuntu %s" % logrotate_file)

    # Перезаписываем конфигурационный файл
    with open(logrotate_file, 'w') as file:
        file.write(''.join(logrotate_config))

    os.system("sudo chown root:root %s" % logrotate_file)
