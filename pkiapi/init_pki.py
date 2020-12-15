
import os
import shutil

from pkiapi.executables_path import EXEC_PATHS

def init_folder_structure(sudo_mode=False):

    retcode = 0
    
    if sudo_mode:       
        os.system("sudo chown -R ubuntu:ubuntu %s" % EXEC_PATHS.VPN_FOLDER)
    
    if os.path.exists(EXEC_PATHS.PKI_FOLDER):
        shutil.rmtree(EXEC_PATHS.PKI_FOLDER)

    pki_folders = [
        EXEC_PATHS.PKI_FOLDER, 
        EXEC_PATHS.PKI_PRIVATE_FOLDER, 
        EXEC_PATHS.PKI_ISSUED_FOLDER, 
        EXEC_PATHS.PKI_REQS_FOLDER,
        EXEC_PATHS.PKI_CERTS_BY_SERIAL_FOLDER
    ]
    
    for directory in pki_folders:
        if not os.path.exists(directory):
            os.mkdir(directory, mode=0o755)
    
    open(EXEC_PATHS.PKI_INDEX_FILE, 'w').close()
    open(EXEC_PATHS.PKI_INDEX_ATTR_FILE, 'w').close()
    open(EXEC_PATHS.PKI_SERIAL_FILE, 'w').close()

    if sudo_mode:
        os.system("sudo chown -R root:root %s" % EXEC_PATHS.VPN_FOLDER)
        
    return retcode
