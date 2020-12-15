import os
import unittest


current_dir = os.path.dirname(os.path.abspath(__file__))
os.environ["OPENSSL"] =  os.path.join(current_dir, 'bin', 'openssl', 'openssl')
os.environ["OPENSSL_CONF"] = os.path.join(current_dir, 'bin', 'openssl', 'openssl.cnf')
os.environ["PKI"] = os.path.join(current_dir, 'pki')


from .pki_methods_spec import TestPkiMethodsRSA

if __name__ == '__main__':

    unittest.main(verbosity=2)