import unittest
from init_pki import init_folder_structure
from executables_path import EXEC_PATHS
from config_methods import create_config


class TestConfigMethods(unittest.TestCase):
     
    def test_01_init_pki(self):
        result = create_config()                                
        self.assertEqual(result, 0)
        
