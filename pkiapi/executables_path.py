"""
Executables path
"""
import os

class EXEC_PATHS: # pylint: disable=invalid-name, too-few-public-methods
    OPENSSL             = os.environ["OPENSSL"]
    OPENVPN_BIN         = os.environ["OPENVPN_BIN"]
    OPENSSL_CONF        = os.environ["OPENSSL_CONF"]
    VPN_FOLDER          = os.environ["OPENVPN"]

    VPN_CONFIG          = os.path.join(VPN_FOLDER, 'openvpn.conf')
    PKI_FOLDER          = os.path.join(VPN_FOLDER, 'pki')

    PKI_PRIVATE_FOLDER  = os.path.join(PKI_FOLDER,  'private')
    PKI_ISSUED_FOLDER   = os.path.join(PKI_FOLDER,  'issued')
    PKI_REQS_FOLDER     = os.path.join(PKI_FOLDER,  'reqs')

    PKI_INDEX_FILE      = os.path.join(PKI_FOLDER,  'index.txt')
    PKI_INDEX_ATTR_FILE = os.path.join(PKI_FOLDER,  'index.txt.attr')
    PKI_SERIAL_FILE     = os.path.join(PKI_FOLDER,  'serial')
    PKI_CRL_FILE        = os.path.join(PKI_FOLDER,  'crl.pem')
    PKI_DH_FILE         = os.path.join(PKI_FOLDER,  'dh.pem')
    PKI_TA_KEY_FILE     = os.path.join(PKI_FOLDER,  'ta.key')

    PKI_CA_KEY          = os.path.join(PKI_PRIVATE_FOLDER,  'ca.key')
    PKI_CA_REQ          = os.path.join(PKI_REQS_FOLDER,     'ca.req')
    PKI_CA_CERT         = os.path.join(PKI_FOLDER,          'ca.crt')
    PKI_SERVER_KEY      = os.path.join(PKI_PRIVATE_FOLDER,  'vpnserver.key')
    PKI_SERVER_REQ      = os.path.join(PKI_REQS_FOLDER,     'vpnserver.req')
    PKI_SERVER_CERT     = os.path.join(PKI_ISSUED_FOLDER,   'vpnserver.crt')

    PKI_CLIENT_KEY      = os.path.join(PKI_PRIVATE_FOLDER,  'client.key')
    PKI_CLIENT_REQ      = os.path.join(PKI_REQS_FOLDER,     'client.req')
    PKI_CLIENT_CERT     = os.path.join(PKI_ISSUED_FOLDER,   'client.crt')
    #certs by serial
    PKI_CERTS_BY_SERIAL_FOLDER = os.path.join(PKI_FOLDER,   'certs_by_serial')
