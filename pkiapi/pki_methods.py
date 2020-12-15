import subprocess

def create_serial(serial_path, openssl_path, sudo_mode=False):
    openssl_parameters = [
        'rand', '-hex', 
        '-out', serial_path,
        '16'
    ]    

    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode


def generate_req(key_type, req_path, key_path, openssl_path, common_name,sudo_mode=False):

    openssl_parameters = [
        'req', '-new',  '-nodes', '-utf8',
        '-newkey',    key_type,
        '-out',       req_path,
        '-keyout',    key_path,
        '-subj',      '/C=RU/ST=Moscow/L=Moscow/CN=' + common_name
    ]

    openssl_parameters  = [openssl_path] + openssl_parameters
    operation_result    = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode


def sign_req(req_path, out_path, sign_key_path, openssl_path, sudo_mode=False):
    openssl_parameters = [
        'x509', '-req', '-days', '3650',
        '-in',          req_path,
        '-out',         out_path,        
        '-signkey',     sign_key_path        
    ]
    
    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def sign_req_with_ca(req_path, out_path, openssl_conf_path, extensions, openssl_path, sudo_mode=False):

    openssl_parameters = [
        'ca', '-utf8',
        '-in',          req_path,
        '-out',         out_path,
        '-extensions',  extensions,
        '-batch'
    ]

    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def gen_crl(crl_path, openssl_path, sudo_mode=False):

    openssl_parameters = [
        'ca', '-utf8', '-gencrl',
        '-out', crl_path
    ]

    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def revoke(crt_in_path, openssl_path, sudo_mode=False):

    openssl_parameters = [
        'ca',  '-utf8', '-revoke',
        crt_in_path
    ]
    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def gen_diffie_hellman(dh_path, openssl_path, sudo_mode=False):
    openssl_parameters = [
        'genpkey',  '-genparam', '-algorithm', 'DH',
        '-out', dh_path,
        '-pkeyopt', 'dh_paramgen_prime_len:1024',
        '-pkeyopt', 'dh_paramgen_generator:2'
    ]
    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command(openssl_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def gen_tls_key(openvpn_path, ta_key_path, sudo_mode=False):
    command_parameters = [
        '--genkey', '--secret' , ta_key_path        
    ]
    command_parameters = [openvpn_path] + command_parameters
    operation_result = execute_command(command_parameters, sudo_mode=sudo_mode)

    return operation_result.returncode

def get_certificate_enddate(crt_in_path, openssl_path, sudo_mode=False):

    openssl_parameters = [
        'x509',  '-in', crt_in_path,
        '-noout',
        '-serial',
        '-fingerprint',
        '-startdate',
        '-enddate'
    ]
    openssl_parameters = [openssl_path] + openssl_parameters
    operation_result = execute_command_with_std(openssl_parameters, sudo_mode)
    return operation_result.stdout



def execute_command(openssl_parameters, sudo_mode=False):
    params = openssl_parameters
    if sudo_mode:
        params = ['sudo', '-E'] + params

    return subprocess.run(params, shell=False)

def execute_command_with_std(openssl_parameters, sudo_mode=False):
    params = openssl_parameters
    if sudo_mode:
        params = ['sudo', '-E'] + params

    return subprocess.run(params,  stdout=subprocess.PIPE, shell=False)
    
    