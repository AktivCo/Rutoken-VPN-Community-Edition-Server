"""
Module with users methods
"""
from django.contrib.auth.models import User
from ldap3 import Server, Connection, SIMPLE, \
    SYNC, SUBTREE
from vpnserver.models import ConfigSettings


def get_users_list(username):
    users = list(User.objects.all().exclude(username='RutokenVpn').order_by('username'))
    userslist = []
    #certs = clr_helper()
    for i in users:
        user = {}
        user['id'] = i.id
        user['username'] = i.username
        user['fullname'] = i.first_name
        user['isDomain'] = not i.has_usable_password()
        user['canGenereateMobileCert'] = True
        user['canGenereateCertOnToken'] = True
        user['isDisabled'] = False

        if hasattr(i, 'cert_access'):
            user['canGenereateMobileCert'] = i.cert_access.can_generate_mobile_cert
            user['canGenereateCertOnToken'] = i.cert_access.can_generate_cert_on_token
            user['isDisabled'] = i.cert_access.is_disabled

        userslist.append(user)
    if username is None:
        return userslist
    else:
        for userslist_item in userslist:
            if username == userslist_item['username']:
                return userslist_item


def get_domain_users():
    config = ConfigSettings.objects.get(pk=1)
    base_dn_list = config.ldap_base_dn.split(".")
    dn_string = ""

    for item in base_dn_list:
        dn_string += "dc="+ item +","
    dn_string = dn_string[:-1]
    users_list = []
    try:
        server = Server(config.domain_server, port=389)
    except: #pylint: disable=bare-except
        print('Domain server is not available. Check IP adress or port number.')
        return users_list
    try:
        connection = Connection(server,
                        auto_bind = True,
                        client_strategy=SYNC,
                        user=config.name + "@" + config.ldap_base_dn,
                        password=config.password,
                        authentication=SIMPLE,
                        check_names=True)
    except: #pylint: disable=bare-except
        print('Cannot connect to the AD. Trying old connection scheme.')
    try:
        connection = Connection(server,
                        auto_bind = True,
                        client_strategy=SYNC,
                        user=base_dn_list[0]+"\\"+ config.name,
                        password=config.password,
                        authentication=SIMPLE,
                        check_names=True
                    )
    except: #pylint: disable=bare-except
        print('Cannot connect to the AD.')
    # Querying AD to load accounts
    try:
        connection.search(
            dn_string, '(objectCategory=person)',
            SUBTREE,
            attributes=['cn', 'sAMAccountName']
        )
    except: #pylint: disable=bare-except
        print('Cannot query the Active Directory')
        return users_list
    for res in connection.response:
        try:
            attributes = res['attributes']
            account_name = attributes['sAMAccountName']
            common_name = attributes['cn']
            if not isinstance(account_name, str):
                continue
            user = {}
            user['username'] = account_name
            user['fullname'] = common_name
            users_list.append(user)
        except: #pylint: disable=bare-except
            continue
    return users_list
