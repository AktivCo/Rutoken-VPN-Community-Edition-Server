import unittest
from init_pki import init_folder_structure
from executables_path import EXEC_PATHS
from pki_methods import generate_req, create_serial, sign_req, sign_req_with_ca, gen_crl, revoke, gen_diffie_hellman


class TestPkiMethods(unittest.TestCase):
    
    def test_01_init_pki(self):
        result = init_folder_structure()
                                
        self.assertEqual(result, 0)
        
    def test_02_create_serial(self):
        result = create_serial(EXEC_PATHS.PKI_SERIAL_FILE, EXEC_PATHS.OPENSSL)                                
        self.assertEqual(result, 0)
        
    def test_03_generate_ca_req(self):
        result = generate_req(
            self.evp_pkey_type, 
            EXEC_PATHS.PKI_CA_REQ, 
            EXEC_PATHS.PKI_CA_KEY, 
            EXEC_PATHS.OPENSSL,
            'ca'
        )
                                
        self.assertEqual(result, 0)

    def test_04_sign_ca_req(self):
        result = sign_req(
            EXEC_PATHS.PKI_CA_REQ,
            EXEC_PATHS.PKI_CA_CERT,
            EXEC_PATHS.PKI_CA_KEY,
            EXEC_PATHS.OPENSSL
        )
                                
        self.assertEqual(result, 0)
    
    def test_05_generate_server_req(self):
        result = generate_req(
            self.evp_pkey_type, 
            EXEC_PATHS.PKI_SERVER_REQ, 
            EXEC_PATHS.PKI_SERVER_KEY, 
            EXEC_PATHS.OPENSSL,
            'server'
        )
                                
        self.assertEqual(result, 0)
    
    def test_06_sign_server_req(self):
        result = sign_req_with_ca(
            EXEC_PATHS.PKI_SERVER_REQ, 
            EXEC_PATHS.PKI_SERVER_CERT,
            EXEC_PATHS.OPENSSL_CONF,
            EXEC_PATHS.OPENSSL         
        )
        self.assertEqual(result, 0)

    def test_07_generate_client_req_1(self):
        result = generate_req(
            self.evp_pkey_type, 
            EXEC_PATHS.PKI_CLIENT_REQ + '_1', 
            EXEC_PATHS.PKI_CLIENT_KEY + '_1', 
            EXEC_PATHS.OPENSSL,
            'client_1'
        )
                                
        self.assertEqual(result, 0)

    def test_08_sign_client_req_1(self):
        result = sign_req_with_ca(
            EXEC_PATHS.PKI_CLIENT_REQ + '_1', 
            EXEC_PATHS.PKI_CLIENT_CERT + '_1',
            EXEC_PATHS.OPENSSL_CONF,
            EXEC_PATHS.OPENSSL         
        )
        self.assertEqual(result, 0)

    def test_09_generate_client_req_2(self):
        result = generate_req(
            self.evp_pkey_type, 
            EXEC_PATHS.PKI_CLIENT_REQ + '_2', 
            EXEC_PATHS.PKI_CLIENT_KEY + '_2', 
            EXEC_PATHS.OPENSSL,
            'client_2'
        )
                                
        self.assertEqual(result, 0)

    def test_10_sign_client_req_2(self):
        result = sign_req_with_ca(
            EXEC_PATHS.PKI_CLIENT_REQ + '_2', 
            EXEC_PATHS.PKI_CLIENT_CERT + '_2', 
            EXEC_PATHS.OPENSSL_CONF,
            EXEC_PATHS.OPENSSL         
        )
        self.assertEqual(result, 0)
    
    def test_11_gen_crl(self):
        result = gen_crl(EXEC_PATHS.PKI_CRL_FILE, EXEC_PATHS.OPENSSL)
        self.assertEqual(result, 0)
    
    def test_12_revoke(self):
        result = revoke(
            EXEC_PATHS.PKI_CLIENT_CERT + '_2', 
            EXEC_PATHS.OPENSSL         
        )
        self.assertEqual(result, 0)
    def test_13_revoke(self):
        result = gen_diffie_hellman(
            EXEC_PATHS.PKI_DH_FILE,
            EXEC_PATHS.OPENSSL         
        )
        
        self.assertEqual(result, 0)
    
    

class TestPkiMethodsRSA(TestPkiMethods):
     
    evp_pkey_type = 'rsa'

