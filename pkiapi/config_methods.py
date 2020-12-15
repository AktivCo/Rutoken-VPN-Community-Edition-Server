from vpnserver import logs_path
# from .executables_path import EXEC_PATHS

def create_server_config(pkey_type, server, ca_cert, server_cert, server_key, dh_key, ta_key,
                         crl, server_dns, routing_table, server_dns_additional = None,
                         verb_level='3', logs_status=False):

        result = 0
        config_builder = []
        config = ''

        config_builder.append('server %s 255.255.255.0\n'   % server)
        config_builder.append('verb %s\n'     % verb_level)
                
        config_builder.append('ca   "%s"\n'   % ca_cert.replace("\\", "\\\\"))
        config_builder.append('key  "%s"\n'   % server_key.replace("\\", "\\\\"))
        config_builder.append('cert "%s"\n'   % server_cert.replace("\\", "\\\\"))
        config_builder.append('dh   "%s"\n'   % dh_key.replace("\\", "\\\\"))
        config_builder.append('tls-auth   "%s"\n'   % ta_key.replace("\\", "\\\\"))
        config_builder.append('key-direction 0\n')
           
        config_builder.append('crl-verify "%s"\n'   % crl.replace("\\", "\\\\"))

        '''cipher section'''
        config_builder.append('\n\n')
        config_builder.append('###cipher section\n\n')

        if 'rsa' in pkey_type:
            config_builder.append('cipher AES-256-CBC\n')            
            config_builder.append('auth sha256\n')


        config_builder.append('management localhost 7000\n\n')

        '''network section'''
        config_builder.append('\n\n')
        config_builder.append('###network section\n\n')

        config_builder.append('keepalive 10 60\n')
        config_builder.append('persist-key\n')
        config_builder.append('persist-tun\n')
        config_builder.append('proto udp\n')  
        config_builder.append('port 1194\n')
        config_builder.append('dev tun0\n')
        config_builder.append('user nobody\n')
        config_builder.append('group nogroup\n')
        config_builder.append('push "dhcp-option  DNS %s"\n' % server_dns)

        if server_dns_additional:
            config_builder.append('push "dhcp-option DNS %s"\n' % server_dns_additional)
        
        if len(routing_table) == 0:
            config_builder.append('push "redirect-gateway def1"\n')
        else:
            for table in routing_table:
                config_builder.append('push "route %s %s" # server"\n' % (table.ip, table.mask))

        if logs_status:
            config_builder.append('###logging section\n\n')
            config_builder.append('log-append %s\n' % logs_path.LOGS_PATH.LOG_FILE_PATH.replace("\\", "\\\\"))

        config = ''.join(config_builder)

        return config


def create_client_config(pkey_type, remote_server, ca_cert_path, dh_key_path, ta_key_path, client_cert_path = None, client_key_path = None, ldap_base_dn = None, server_dns = None):


        result = 0
        config_builder = []
        config = ''        

        config_builder.append('client\n')
        config_builder.append('verb 3\n')
        config_builder.append('nobind\n')
        config_builder.append('dev tun\n')
        config_builder.append('remote %s\n' % remote_server)
       

        '''CA section '''
        with open(ca_cert_path, 'r') as file:
            config_builder.append('<ca>\n')
            config_builder.append(file.read())
            config_builder.append('</ca>\n')


        '''private key section '''
        if client_key_path is not None:
            with open(client_key_path, 'r') as file:
                config_builder.append('<key>\n')
                config_builder.append(file.read())
                config_builder.append('</key>\n')
        
        '''certificate section '''
        if client_cert_path is not None:
            with open(client_cert_path, 'r') as file:
                config_builder.append('<cert>\n')
                config_builder.append(file.read())
                config_builder.append('</cert>\n')
        
        '''DH section '''
        with open(dh_key_path, 'r') as file:
            config_builder.append('<dh>\n')
            config_builder.append(file.read())
            config_builder.append('</dh>\n')
        
        '''TLS-auth section '''
        config_builder.append('remote-cert-tls server\n')        
        with open(ta_key_path, 'r') as file:
            config_builder.append('<tls-auth>\n')
            config_builder.append(file.read())
            config_builder.append('</tls-auth>\n')
        config_builder.append('key-direction 1\n')        
            


        '''cipher section'''
        config_builder.append('\n\n')
        config_builder.append('###cipher section\n\n')

        if 'rsa' in pkey_type:
            config_builder.append('cipher AES-256-CBC\n')            
            config_builder.append('auth sha256\n')


        '''network section'''
        config_builder.append('\n\n')
        config_builder.append('###network section\n\n')

        
        config_builder.append('persist-key\n')
        config_builder.append('persist-tun\n')
        config_builder.append('proto udp\n')  
        config_builder.append('port 1194\n')
   
        if ldap_base_dn is not None:
            config_builder.append('dhcp-option DOMAIN %s\n' % ldap_base_dn)
        
        if server_dns is not None:
            config_builder.append('dhcp-option DNS %s\n' % server_dns)
        
        config = ''.join(config_builder)


        return config