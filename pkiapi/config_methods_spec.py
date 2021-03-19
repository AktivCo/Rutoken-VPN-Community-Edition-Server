"""
Configuration methods tests
"""
import unittest
from config_methods import create_config

class TestConfigMethods(unittest.TestCase):
    def test_01_init_pki(self):
        result = create_config()
        self.assertEqual(result, 0)
