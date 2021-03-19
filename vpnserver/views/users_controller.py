"""
users controller module
"""
import json
import time
import os

from telnetlib import Telnet

from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.http import require_POST

from vpnserver.users_helper import get_users_list, get_domain_users
from vpnserver.os_helper import clr_helper, revoke_helper, disconnect_user
from vpnserver.models import AccessToCertGeneration
from vpnserver import environment

def get_domainusers_list(request):
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        if request.method == "GET":
            users_list = get_domain_users()
            response = json.dumps(sorted(users_list, key=lambda user: user['username']))
            return HttpResponse(response, content_type="application/json")
        else:
            return HttpResponseBadRequest()
    else:
        return HttpResponse('Unauthorized', status=401)


def users(request):
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        if request.method == "GET":
            user_id = request.GET.get('id')
            if user_id is None:
                userslist = get_users_list(None)
                response = json.dumps(userslist)
                return HttpResponse(response, content_type="application/json")
            else:
                user = User.objects.get(pk=id)
                if not environment.is_demo_mode():
                    certs = clr_helper(user.username)
                    u_certs = [k for k in certs if user.username in k['username']]
                    for i in u_certs:
                        revoke_helper(i['cert'])
                        disconnect_user(i['cert'])
                user.delete()
                return HttpResponse(status=200, content_type="application/json")

        else:
            username = str(request.POST.get("name")).lower()
            password = str(request.POST.get("password"))
            fullname = str(request.POST.get("fullname"))
            current_user = User(username=username, first_name=fullname)
            if password == 'undefined':
                current_user.set_unusable_password()
            else:
                current_user.set_password(password)
            current_user.save()
            return HttpResponse(status=200, content_type="application/json")
    return HttpResponse('Unauthorized', status=401)

def vpn_config_crl(request):
    if request.user.is_authenticated():
        if request.method == "POST":
            if time.time() < 1458893516.0:  # check time
                return HttpResponseBadRequest()
            if environment.is_demo_mode():
                return HttpResponse(content_type="application/json", status=200)

            name = str(request.POST.get("certificate"))
            encodedname = name.encode('utf-8').strip()
            clientname = encodedname.decode('utf-8')
            revoke_helper(clientname)
            disconnect_user(clientname)
            os.system('sudo systemctl reload openvpn@openvpn')
            return HttpResponse(content_type="application/json", status=200)
        else:
            crl_list = []
            if not environment.is_demo_mode():
                if request.user.username == "RutokenVpn":
                    crl_list = clr_helper(None)
                else:
                    crl_list = clr_helper(request.user.username)
            else:
                model = {}

                model['username'] = 'test'
                model['date'] = 1458893516
                model['type'] = "mobileClient"
                model['cert'] = ""
                crl_list.append(model)
            response = json.dumps(crl_list)
            return HttpResponse(response, content_type="application/json")
    return HttpResponse('Unauthorized', status=401)

def vpn_config_connected_users(request):
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        #type 0 - date from client
        #type 1 - ntp server
        if request.method != "GET":
            return HttpResponseBadRequest()

        connected_users = []
        if not environment.is_demo_mode():
            try:
                telnet_client = Telnet('localhost', 7000)
                k = telnet_client.read_until(b"type 'help' for more info").decode('ascii')
                if "type 'help' for more info" in k:
                    telnet_client.write('status\n'.encode('ascii'))
                    status = telnet_client.read_until(b'ROUTING TABLE').decode('ascii')
                    telnet_client.close()
                    status_arr = status.split("\r\n")
                    status_arr.pop(len(status_arr)-1)

                    for counter in range(0,4): #pylint: disable=unused-variable
                        status_arr.pop(0)

                    for item in status_arr:
                        split = item.split(',')
                        username = item.split('_')[0]
                        connected = {
                            'username': username,
                            'cert': split[0],
                            'ip': split[1],
                            'bytesSent': split[2],
                            'bytesReceived': split[3],
                            'connectionTime': split[4]
                        }
                        connected_users.append(connected)
            except: #pylint: disable=bare-except
                print("---cannot telnet to the openvpn management interface--")
        else:
            connected = {
                'username': 'test',
                'cert': 'test',
                'ip': '192.168.1.1',
                'bytesSent': 0,
                'bytesReceived': 0,
                'connectionTime': 0
            }
            connected_users.append(connected)
        response = json.dumps(connected_users)
        return HttpResponse(response, content_type="application/json")
    return HttpResponse('Unauthorized', status=401)


def vpn_config_disconnect_user(request):
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        #type 0 - date from client
        #type 1 - ntp server
        if request.method != "GET":
            return HttpResponseBadRequest()
        client = str(request.GET.get("client"))
        disconnect_user(client)
        return HttpResponse(status=200)
    return HttpResponse('Unauthorized', status=401)


@require_POST
def sync_with_ad(request):
    if not request.user.is_authenticated() and not request.user.username == "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)

    try:
        data = json.loads(request.body.decode('utf-8')).get('users', None)
    except json.JSONDecodeError:
        return HttpResponseBadRequest()

    if data is None:
        return HttpResponseBadRequest()

    try:
        users_to_update = {x['id']: x['newFullName'] for x in data}
    except KeyError:
        return HttpResponseBadRequest()

    ids = users_to_update.keys()
    users_list = User.objects.exclude(pk=1).filter(pk__in=ids)

    if not users_list.exists():
        return HttpResponseBadRequest()

    for user_id in ids:
        user = users_list.get(pk=user_id)
        user.first_name = users_to_update[user_id]
        user.save(update_fields=['first_name'])
    return HttpResponse(status=200)


def cert_access(request):
    if not request.user.is_authenticated() and request.user.username is not "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)

    if not request.method == "POST":
        return HttpResponseBadRequest()

    cert_types = ('canGenereateMobileCert', 'canGenereateCertOnToken')

    user_id = request.POST.get('id', None)
    cert_type = request.POST.get('certType', None)
    value = request.POST.get('value', False)

    if user_id is None or cert_type is None or value is None or cert_type not in cert_types:
        return HttpResponseBadRequest()

    if not User.objects.filter(id=user_id).exists():
        return HttpResponseBadRequest()

    user = User.objects.get(id=user_id)

    if user.username is "RutokenVpn":
        return HttpResponseBadRequest()

    value = value == 'true'

    if not hasattr(user, 'cert_access'):
        user_access = AccessToCertGeneration()
        user_access.user = user
    else:
        user_access = user.cert_access

    if cert_type == 'canGenereateMobileCert':
        user_access.can_generate_mobile_cert = value
    if cert_type == 'canGenereateCertOnToken':
        user_access.can_generate_cert_on_token = value
    user_access.save()

    return JsonResponse(
        {
            'id': user_access.user.id,
            'canGenereateMobileCert': user_access.can_generate_mobile_cert,
            'canGenereateCertOnToken': user_access.can_generate_cert_on_token,
        }
    )
