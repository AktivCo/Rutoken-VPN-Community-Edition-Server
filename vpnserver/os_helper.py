import os
import re
from telnetlib import Telnet
from pkiapi import executables_path, pki_methods

def clr_helper(username):
    st = []
    result = []
    os.system('sudo chmod o+x  %s' % executables_path.EXEC_PATHS.VPN_FOLDER)
    os.system("sudo chown ubuntu:ubuntu %s" % executables_path.EXEC_PATHS.PKI_INDEX_FILE)

    with open(executables_path.EXEC_PATHS.PKI_INDEX_FILE, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line[0] == "V":
                k, v = line.split("/CN=")
                if not 'vpnserver' in v:
                    username_cert, cert = v.split("_", 1)
                    if username_cert.startswith('\\x'):
                        hex_string_name = re.sub(r'\\x', '', username_cert)
                        byte_name = bytes.fromhex(hex_string_name)
                        decoded_name = byte_name.decode('utf-8')
                        res = '_'.join([decoded_name, cert])
                        st.append(res)
                    else:
                        st.append(v)
    st = sorted(st)

    os.system("sudo chown root:root %s" % executables_path.EXEC_PATHS.PKI_INDEX_FILE)

    for i in st:
        temp = i.split('_')
        model = {}

        model['username'] = temp[0]
        model['date'] = temp[1]
        model['type'] = temp[2]
        model['cert'] = i
        if username == None:
            result.append(model)
        else:
            if username == temp[0]:
                result.append(model)
    return result

def disconnect_user(clientname):
    if os.name is not 'nt':
        try:
            t = Telnet('localhost', 7000)
            k = t.read_until(b"type 'help' for more info").decode('ascii')
            if "type 'help' for more info" in k:
                t.write(('kill %s\n' % clientname).encode('ascii'))
                t.close()
        except:
            print("---cannot telnet to the openvpn management interface--")


def revoke_helper(clientname):
    cert_path = os.path.join(executables_path.EXEC_PATHS.PKI_ISSUED_FOLDER, "%s.crt" % clientname.replace('\n', ''))
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
