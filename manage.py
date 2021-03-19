#!/usr/bin/env python

"""
Main module
"""

import os
import sys

if __name__ == "__main__":

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Vpn.settings")
    current_dir = os.path.dirname(os.path.abspath(__file__))

    if  os.environ.get("OPENVPN") is None:
        os.environ["OPENVPN"] = os.path.join(current_dir, "openvpn")
    if  os.environ.get("OPENVPN_BIN") is None:
        os.environ["OPENVPN_BIN"] =  '/usr/bin/openvpn'

    if  os.environ.get("OPENSSL") is None:
        os.environ["OPENSSL"] =  '/usr/bin/openssl'
    if  os.environ.get("OPENSSL_CONF") is None:
        os.environ["OPENSSL_CONF"] = os.path.join(current_dir , 'Vpn', 'config', 'openssl.cnf')
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
