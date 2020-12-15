from django.contrib.auth.models import User
from ldap3 import ObjectDef, Server, Connection, AUTH_SIMPLE, STRATEGY_SYNC, SEARCH_SCOPE_WHOLE_SUBTREE
from vpnserver.models import ConfigSettings


def get_users_list(username):
    users = list(User.objects.all().exclude(username='RutokenVpn').order_by('username'))
    userslist = []
    #certs = clr_helper()
    for i in users:
        u = {}
        u['id'] = i.id
        u['username'] = i.username
        u['fullname'] = i.first_name
        u['isDomain'] = not i.has_usable_password()
        u['canGenereateMobileCert'] = True
        u['canGenereateCertOnToken'] = True

        if hasattr(i, 'cert_access'):
            u['canGenereateMobileCert'] = i.cert_access.can_generate_mobile_cert
            u['canGenereateCertOnToken'] = i.cert_access.can_generate_cert_on_token

        userslist.append(u)
    if username == None:
        return userslist
    else:        
        for x in userslist:
            if username in x['username']:
                return x


def get_domain_users():
    config = ConfigSettings.objects.get(pk=1)
    base_dn_list = config.ldap_base_dn.split(".")
    dn_string = ""

    for item in base_dn_list:
        dn_string += "dc="+ item +","
    dn_string = dn_string[:-1]
    person = ObjectDef('inetOrgPerson')
    users_list = []
    try:
        server = Server(config.domain_server, port=389)
    except:
        print('Domain server is not available. Check IP adress or port number.')
        return users_list
    try:
        connection = Connection(server,
                        auto_bind = True,
                        client_strategy=STRATEGY_SYNC,
                        user=config.name + "@" + config.ldap_base_dn,
                        password=config.password,
                        authentication=AUTH_SIMPLE,
                        check_names=True)
    except:
        print('Cannot connect to the AD. Trying old connection scheme.')
    try:
        connection = Connection(server, 
                        auto_bind = True,
                        client_strategy=STRATEGY_SYNC,
                        user=base_dn_list[0]+"\\"+ config.name,
                        password=config.password,
                        authentication=AUTH_SIMPLE,
                        check_names=True)
    except:
        print('Cannot connect to the AD.')
    # Querying AD to load accounts
    try:
        connection.search(dn_string, '(objectCategory=person)', SEARCH_SCOPE_WHOLE_SUBTREE, attributes=['cn', 'sAMAccountName'])
    except:
        print('Cannot query the Active Directory')
        return users_list
    for res in connection.response:
        try:
            attributes = res['attributes']
            account_name = attributes['sAMAccountName'][0]
            cn = attributes['cn'][0]
            u = {}
            u['username'] = account_name
            u['fullname'] = cn
            users_list.append(u)
        except:
            continue

    return users_list