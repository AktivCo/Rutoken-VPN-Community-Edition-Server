"""
Logs path module
"""
import os

class LOGS_PATH: # pylint: disable=invalid-name, too-few-public-methods

    LOGS_DIR            = '/var/log/openvpn/'
    LOG_FILE_NAME       = 'openvpn.log'
    LOG_FILE_PATH       = os.path.join(LOGS_DIR, LOG_FILE_NAME)

    LOGROTATE_DIR       = '/etc/logrotate.d'
    LOGRORATE_FILE_PATH = os.path.join(LOGROTATE_DIR, 'openvpn')
