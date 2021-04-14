"""
setting controller module
"""
import json
import os

from django.contrib import auth
from django.contrib.auth.models import User

from django.core import serializers
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseBadRequest

from vpnserver.models import ConfigPki, ConfigNtp, TaskStatus
from vpnserver.identity_helper import is_authenticated

from vpnserver import environment

def vpn_config_admpwd(request):
    if is_authenticated(request) and request.user.username == "RutokenVpn":
        if request.method == "POST":
            try:
                user = auth.authenticate(
                    username="RutokenVpn",
                    password=str(request.POST.get("password0"))
                )
            except ValidationError:
                return HttpResponse(json.dumps({
                    'error': True,
                    'message': "Неверный логин или пароль"
                }), status=500)

            if user is not None:
                current_user = User.objects.get(username='RutokenVpn')
                password = str(request.POST.get("password1"))
                current_user.set_password(password)
                current_user.save()
                if not environment.is_demo_mode():
                    os.system(
                        'echo "ubuntu:%s" | sudo chpasswd' % password
                    )  # change ubuntu password
                return HttpResponse(status=200)
            else:
                return HttpResponse(json.dumps({
                    'error': True,
                    'message': "Неверный логин или пароль"
                }), status=500)
        else:
            return HttpResponseBadRequest()
    else:
        return HttpResponse('Unauthorized', status=401)

def settings(request):
    if not is_authenticated(request):
        return HttpResponse('Unauthorized', status=401)
    current_settings = {}
    if ConfigPki.objects.exists():
        type_p = ConfigPki.objects.get(pk=1)
        data = serializers.serialize('json', [type_p])
        struct = json.loads(data)
        data = struct[0]["fields"]["pki_type"]
        pki_type = data
    else:
        pki_type = None
    current_settings["pkiType"] = pki_type

    rsa = {}
    rsa['title'] = 'RSA'
    rsa['pkeyType'] = 'rsa'
    pki_options = [ rsa ]
    current_settings["pkiOptions"] = pki_options

    #current machine vpnserver cert settings

    return HttpResponse(json.dumps(current_settings), status=200)



def manage_box(request):
    if is_authenticated(request) and request.user.username == "RutokenVpn":
        action = int(request.GET.get("action"))
        if action == 0 or action == 1:
            task_status = TaskStatus.objects.get(pk=1)
            task_status.status = TaskStatus.FINISHED
            task_status.type = TaskStatus.REBOOT_TYPE
            task_status.save()
        if action == 1:
            if not environment.is_demo_mode():
                os.system("sudo shutdown -t 0")
        if action == 0:
            if not environment.is_demo_mode():
                os.system("sudo shutdown -r -t 0")

        return HttpResponse(status=200)
    else:
        return HttpResponse('Unauthorized', status=401)


def vpn_config_ntp(request):
    if is_authenticated(request) and request.user.username == "RutokenVpn":
        #type 0 - date from client
        #type 1 - ntp server
        if request.method == "POST":
            operation_type = int(request.POST.get("type"))
            data = str(request.POST.get("data"))
            if operation_type == 0 or operation_type == 1:
                if not environment.is_demo_mode():
                    os.system("sudo chmod 776 /etc/rc.local")
                    with open('/etc/rc.local', "r+") as ntp_config_file:
                        st_lines = ntp_config_file.readlines()
                        ntp_config_file.seek(0)
                        ntp_config_file.truncate()
                        if operation_type == 0:
                            os.system("sudo date %s" % data)
                            for i,item in enumerate(st_lines):
                                if "ntpdate" in item or "ifup" in item:
                                    continue
                                ntp_config_file.write(item)
                            data = None
                        if operation_type == 1:
                            os.system("sudo ntpdate %s" % data)
                            change = False
                            for i,item in enumerate(st_lines):
                                if 'ntp' in item:
                                    st_lines[i] = "ifup eth0 \nntpdate %s\n" % data
                                    change = True
                                if "ifup" in item:
                                    st_lines[i] = "\n"
                            if not change:
                                st_lines.insert(
                                    (len(st_lines)-2), "ifup eth0 \nntpdate %s\n" % data
                                )
                            ntp_config_file.writelines(st_lines)
                    os.system("sudo chmod 771 /etc/rc.local")
                try:
                    config = ConfigNtp.objects.get(pk=1)
                except ObjectDoesNotExist:
                    config = ConfigNtp(ntp_server=data)
                else:
                    config.ntp_server = data
                config.save()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=400)
        else:
            try:
                config = ConfigNtp.objects.get(pk=1)
            except ObjectDoesNotExist:
                response = json.dumps(None)
            else:
                data = serializers.serialize('json', [config])
                struct = json.loads(data)
                data = json.dumps(struct[0]["fields"])
                response = data
            return HttpResponse(response, content_type="application/json")
    else:
        return HttpResponse('Unauthorized', status=401)
