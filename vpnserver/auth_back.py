"""
Authentication module
"""
from ldap3 import Server, Connection, SIMPLE, SYNC, SUBTREE
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from vpnserver.models import ConfigSettings

class ADBackend(object):
    """
    Ms Active directory auth
    """
    def authenticate(self, request, username=None, password=None):
        try:
            config = User.objects.get(pk=1)
        except ObjectDoesNotExist:
            if username != 'RutokenVpn' or password != 'RutokenVpn':
                return None
            default_user = User(username='RutokenVpn')  # creating superuser, if he is not init
            default_user.set_password('RutokenVpn')
            default_user.is_superuser = True
            default_user.is_staff = True
            default_user.save()
            return default_user
        else:
            user_name = username.lower()
            try:
                user = User.objects.get(username=user_name)
            except: #pylint: disable=bare-except
                return None
            else:
                if user.has_usable_password():
                    if user.check_password(password):
                        return user
                    else:
                        return None
                else:
                    config = ConfigSettings.objects.get(pk=1)
                    base_dn_list = config.ldap_base_dn.split(".")

                    dn_string = ""
                    for item in base_dn_list:
                        dn_string += "dc="+item +","
                    dn_string = dn_string[:-1]
                    try:
                        server = Server(config.domain_server, port=389)
                    except: #pylint: disable=bare-except
                        print('Domain server is not available. Check IP adress or port number.')
                        return None
                    try:
                        connection = Connection(server,
                                                auto_bind = True,
                                                client_strategy=SYNC,
                                                user=user_name + "@" + config.ldap_base_dn,
                                                password=password,
                                                authentication=SIMPLE,
                                                check_names=True)
                    except: #pylint: disable=bare-except
                        print('Cannot connect to the AD. Trying old connection scheme.')
                    try:
                        connection = Connection(
                            server,
                            auto_bind=True,
                            client_strategy=SYNC,
                            user=base_dn_list[0]+"\\"+ user_name,
                            password=password,
                            authentication=SIMPLE,
                            check_names=True
                        )
                    except: #pylint: disable=bare-except
                        print('Cannot connect to the AD.')
                    try:
                        connection.search(dn_string, '(sAMAccountName=%s)' % user_name,
                                        SUBTREE,
                                        attributes=['sAMAccountName','displayName'])
                    except: #pylint: disable=bare-except
                        print('Cannot query the Active Directory')
                        return None
                    response = connection.response #pylint: disable=unused-variable

                    return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
