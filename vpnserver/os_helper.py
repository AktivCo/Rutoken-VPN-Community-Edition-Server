"""
Helper for managing os commands
"""
import os
import re
import subprocess
from vpnserver.users_helper import get_users_list
from telnetlib import Telnet
from pkiapi import executables_path, pki_methods
from django.contrib.auth.models import User

def clr_helper(username):
    st_list = []
    result = []
    os.system('sudo chmod o+x  %s' % executables_path.EXEC_PATHS.VPN_FOLDER)
    os.system("sudo chown ubuntu:ubuntu %s" % executables_path.EXEC_PATHS.PKI_INDEX_FILE)

    with open(executables_path.EXEC_PATHS.PKI_INDEX_FILE, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line[0] == "V":
                k, v_line = line.split("/CN=") #pylint: disable=unused-variable
                if not 'vpnserver' in v_line:
                    username_cert, timestamp, cert_client_type = v_line.rsplit("_", 2)
                    cert = "_".join([timestamp, cert_client_type])
                    if username_cert.startswith('\\x'):
                        hex_string_name = re.sub(r'\\x', '', username_cert)
                        byte_name = bytes.fromhex(hex_string_name)
                        decoded_name = byte_name.decode('utf-8')
                        res = '_'.join([decoded_name, cert])
                        st_list.append(res)
                    else:
                        st_list.append(v_line)
    st_list = sorted(st_list)

    os.system("sudo chown root:root %s" % executables_path.EXEC_PATHS.PKI_INDEX_FILE)

    for i in st_list:
        temp = i.rsplit('_', 2)
        model = {}

        model['username'] = temp[0]
        model['date'] = temp[1]
        model['type'] = temp[2]
        model['cert'] = i
        if username is None:
            result.append(model)
        else:
            if username == temp[0]:
                result.append(model)
    return result

def disconnect_user(clientname):
    if os.name is not 'nt':
        try:
            telnet = Telnet('localhost', 7000)
            k = telnet.read_until(b"type 'help' for more info").decode('ascii')
            if "type 'help' for more info" in k:
                telnet.write(('kill %s\n' % clientname).encode('ascii'))
                telnet.close()
            
        except: #pylint:disable=bare-except
            print("---cannot telnet to the openvpn management interface--")

def block_user(user_access):
    os.system('sudo chmod o+rwx -R %s' % executables_path.EXEC_PATHS.OPENVPN_CCD)
    os.system("sudo chown ubuntu:ubuntu -R %s" % executables_path.EXEC_PATHS.OPENVPN_CCD)
    # First af all we need to find all client's certs in crl
    certs = clr_helper(user_access.user.username)
    # Next step is to determine which ones are exist in ccd directory
    # If there are no matched files in the directory, then we must create files that will be named exactly as certs names.
    u_certs = [k for k in certs if user_access.user.username in k['username']]
    # If we unblock user
    if user_access.is_blocked:
        for usr in u_certs:
            usr_cert_name = usr['cert'].split('?')
            if len(usr_cert_name) > 1:
                usr_cert_name = "".join(usr_cert_name[:-1])
            else:
                usr_cert_name = usr['cert']
            cert_path = os.path.join(
                executables_path.EXEC_PATHS.OPENVPN_CCD,
                usr_cert_name
            ).replace('\n', '')
            if os.path.exists(cert_path):
                os.remove(cert_path)
        # Unblock user
        user_access.is_blocked = False
    # If we block user
    else:
        for usr in u_certs:
            # Disconnect current client
            usr_cert_name = usr['cert'].split('?')
            if len(usr_cert_name) > 1:
                usr_cert_name = "".join(usr_cert_name[:-1])
            else:
                usr_cert_name = usr['cert']
            disconnect_user(usr_cert_name)
            cert_path = os.path.join(
                executables_path.EXEC_PATHS.OPENVPN_CCD,
                usr_cert_name
            ).replace('\n', '')
            # If file with given cert name exist
            if os.path.isfile(cert_path):
                # Add 'disable' on the first line
                os.system('echo \'disable\' > %s' % cert_path)
            # If not, then we create new file and write "echo 'disable'" inside of them
            else:
                # Create file
                os.system('touch %s' % cert_path)
                # Add 'disable' on the first line
                os.system('echo \'disable\' > %s' % cert_path)
        # Block user
        user_access.is_blocked = True
        user_access.is_disabled = True

    user_access.save()

    return user_access

def revoke_helper(clientname):
    cert_path = os.path.join(
        executables_path.EXEC_PATHS.PKI_ISSUED_FOLDER,
        "%s.crt" % clientname.replace('\n', '')
    )
    pki_methods.revoke(
        cert_path,
        executables_path.EXEC_PATHS.OPENSSL,
        True
    )

    pki_methods.gen_crl(
        executables_path.EXEC_PATHS.PKI_CRL_FILE,
        executables_path.EXEC_PATHS.OPENSSL,
        True
    )
