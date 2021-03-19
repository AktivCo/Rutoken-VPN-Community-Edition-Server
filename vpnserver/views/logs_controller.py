"""
logs controller module
"""
import os
import json

from django.core import serializers
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from vpnserver import logs_path

from vpnserver.models import (
    ConfigNetwork,
    ConfigVpn,
    ConfigPki,
    ConfigRouting,
    ConfigLogs,
)
from vpnserver.tasks import setnewvpn
from vpnserver import environment

def get_logs_list(request):
    if not request.user.is_authenticated() and request.user.username == "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)
    if not request.method == "GET":
        return HttpResponseBadRequest()
    if environment.is_demo_mode():
        return JsonResponse({'logs_list': []})
    logs_list = os.listdir(logs_path.LOGS_PATH.LOGS_DIR)
    return JsonResponse({'logs_list': logs_list})


def clear_logs(request):
    if not request.user.is_authenticated() and request.user.username == "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)
    if not request.method == "POST":
        return HttpResponseBadRequest()
    if request.POST.get('clear') == 'true':
        if not environment.is_demo_mode():
            os.system('sudo rm -f {}*'.format(logs_path.LOGS_PATH.LOGS_DIR))
        return HttpResponse(status=200)
    return HttpResponseBadRequest()


def logs_enable(request):
    if not request.user.is_authenticated() and request.user.username == "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)

    if request.method == "POST":
        try:
            config = ConfigLogs.objects.get(pk=1)
            if request.POST.get('set_is_enable_to') == 'true':
                config.is_enabled = True
                config.level = int(request.POST.get('level'))

            elif request.POST.get('set_is_enable_to') == 'false':
                config.is_enabled = False
                config.level = int(request.POST.get('level'))
            config.save()

            config_vpn = ConfigVpn.objects.get(pk=1)
            config_network = ConfigNetwork.objects.get(pk=1)
            config_ca = ConfigPki.objects.get(pk=1)
            routing_table = ConfigRouting.objects.all()

            if not environment.is_demo_mode():
                setnewvpn(config_ca.pki_type, config_vpn.server_name,
                    config_network.server_dns1,
                    config_network.server_dns2, routing_table,
                    verb_level=str(config.level), logs_status=config.is_enabled)
        except ObjectDoesNotExist:
            config = ConfigLogs.objects.create(pk=1, is_enabled=True)
    elif request.method == "GET":
        try:
            config = ConfigLogs.objects.get(pk=1)
        except ObjectDoesNotExist:
            config = ConfigLogs.objects.create(pk=1, is_enabled=False)
    data = serializers.serialize('json', [config])
    struct = json.loads(data)
    data = json.dumps(struct[0]["fields"])
    response = data
    return HttpResponse(response, content_type="application/json")
