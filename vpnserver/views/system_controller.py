"""
system controller module
"""
import json
import time
import re
import os
from datetime import datetime

from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse


from vpnserver import environment
from vpnserver.models import (
    ConfigSettings,
    ConfigNetwork,
    key_generator,
    TaskStatus,
    ConfigVpn,
    ConfigPki,
    ConfigRouting,
)
from vpnserver.tasks import setnewpki, set_new_ip, setnewvpn

from pkiapi import executables_path, pki_methods



def vpn_config_network(request):
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        if request.method == "POST":
            try:
                config = ConfigNetwork.objects.get(pk=1)
            except ObjectDoesNotExist:

                try:
                    config = ConfigNetwork(
                        server_eth_mode="m",
                        server_ip=str(request.POST.get("server_ip")),
                        server_mask=str(request.POST.get("server_mask")),
                        server_gate=str(request.POST.get("server_gate")),
                        server_dns1=str(request.POST.get("server_dns1")),
                        server_dns2=str(request.POST.get("server_dns2"))
                    )
                except: #pylint: disable=bare-except
                    return HttpResponseBadRequest()

            else:
                print(str(request.POST.get("server_ip")))

                config.server_eth_mode = "m"
                config.server_ip = str(request.POST.get("server_ip"))
                config.server_mask = str(request.POST.get("server_mask"))
                config.server_gate = str(request.POST.get("server_gate"))
                config.server_dns1 = str(request.POST.get("server_dns1"))
                config.server_dns2 = str(request.POST.get("server_dns2"))

            config.save()
            if not environment.is_demo_mode():
                set_new_ip()
            return HttpResponse(status=200)
        else:
            try:
                config = ConfigNetwork.objects.get(pk=1)
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

def vpn_config_pki(request):
    """
    Config server page view.
    :param request:
    :return:
    """
    if not request.user.is_authenticated():
        return HttpResponse('Unauthorized', status=401)
    if request.method == "POST" and request.user.username == "RutokenVpn":
        if time.time() < 1458893516.0:  # check time
            return HttpResponseBadRequest()

        common_name = str(request.POST.get("common_name"))
        pki_type = str(request.POST.get("pki_type"))

        if not re.match("^[А-Яа-я,Ё,ё,\w,\s,\",\',\.,\,,\-]+$", common_name):  # check common name for wrong symbol pylint: disable=line-too-long, anomalous-backslash-in-string
            return HttpResponseBadRequest()
        try:
            config = ConfigPki.objects.get(pk=1)
        except ObjectDoesNotExist:
            config = ConfigPki(common_name=common_name, pki_type=pki_type)
        else:
            config.common_name = common_name
            config.pki_type = pki_type

        try:
            task_status = TaskStatus.objects.get(pk=1)
        except: #pylint: disable=bare-except
            task_status = TaskStatus(status=TaskStatus.STARTED, type = TaskStatus.PKI_TYPE)
        else:
            task_status.status = TaskStatus.STARTED
            task_status.type = TaskStatus.PKI_TYPE
        task_status.save()
        if not environment.is_demo_mode():
            newtask = setnewpki.delay(common_name, pki_type) #pylint: disable=unused-variable
        else:
            task_status.status = TaskStatus.FINISHED
            task_status.save()
        config.save()

        return HttpResponse(status=200)
    else:
        try:
            config = ConfigPki.objects.get(pk=1)
        except ObjectDoesNotExist:
            response = json.dumps(None)
        else:
            data = serializers.serialize('json', [config])
            struct = json.loads(data)
            data = json.dumps(struct[0]["fields"])
            response = data
        return HttpResponse(response, content_type="application/json")


def vpn_config_vpn(request):
    """
    Config server page view.
    :param request:
    :return:
    """
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        if request.method == "POST":
            if time.time() < 1458893516.0:  # check time
                return HttpResponseBadRequest()
            try:
                server_name = str(request.POST.get("server_name"))
                external_ip = str(request.POST.get("external_ip"))
                cipher = str(request.POST.get("cipher"))

                config = ConfigVpn.objects.get(pk=1)
            except ObjectDoesNotExist:
                config = ConfigVpn(server_name=server_name, external_ip=external_ip, cipher=cipher)
            else:
                config.server_name = server_name
                config.external_ip = external_ip
                config.cipher = cipher

            config_network = ConfigNetwork.objects.get(pk=1)
            config_ca = ConfigPki.objects.get(pk=1)
            routing_table = ConfigRouting.objects.all()
            if not environment.is_demo_mode():
                setnewvpn(
                    config_ca.pki_type,
                    server_name,
                    config_network.server_dns1,
                    config_network.server_dns2,
                    routing_table
                )
            config.save()
            return HttpResponse(status=200)
        else:
            try:
                config = ConfigVpn.objects.get(pk=1)
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


def vpn_config_domain(request):
    """
    Config server page view.
    :param request:
    :return:
    """
    if request.user.is_authenticated() and request.user.username == "RutokenVpn":
        if request.method == "POST":
            try:
                config = ConfigSettings.objects.get(pk=1)
            except ObjectDoesNotExist:
                server_key_field = str(key_generator())
                config = ConfigSettings(
                    server_key=server_key_field,
                    server_type="r",  # use Rsa type
                    domain_server=str(request.POST.get("domain_server")),
                    ldap_base_dn=str(request.POST.get("ldap_base_dn")),
                    name=str(request.POST.get("name")),
                    password=str(request.POST.get("password"))
                )
                # newtask = setnewpki.delay(server_name_field)
                # task_status = TaskStatus(task_id=newtask.task_id, status=False)
                # task_status.save()
            else:

                config.domain_server = str(request.POST.get("domain_server"))
                config.ldap_base_dn = str(request.POST.get("ldap_base_dn"))
                config.password = str(request.POST.get("password"))
                config.name = str(request.POST.get("name"))
            config.save()
            return HttpResponse(status=200)

        else:
            try:
                config = ConfigSettings.objects.get(pk=1)
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


def vpn_config_routing(request):
    """
    Config server page view.
    :param request:
    :return:
    """
    if not request.user.is_authenticated() and request.user.username != "RutokenVpn":
        return HttpResponse('Unauthorized', status=401)

    if time.time() < 1458893516.0:  # check time
        return HttpResponseBadRequest()
    if request.method == "POST":
        routing_list_ip = request.POST.getlist("ip")
        routing_list_mask = request.POST.getlist("mask")
        routing_dns = request.POST.get("dns")

        if len(routing_list_ip) != len(routing_list_mask):
            return HttpResponseBadRequest()

        ConfigRouting.objects.all().delete()

        if routing_dns == 'true':
            dns = ConfigNetwork.objects.get(pk=1).server_dns1
            if dns in routing_list_ip:
                dns_index = routing_list_ip.index(dns)
                routing_list_mask[dns_index] = '255.255.255.255'
            else:
                routing_list_ip.append(dns)
                routing_list_mask.append('255.255.255.255')

        for i, ip in enumerate(routing_list_ip): #pylint: disable=invalid-name, unused-variable
            ConfigRouting.objects.create(
                ip=routing_list_ip[i],
                mask=routing_list_mask[i]
            ).save()

        return HttpResponse(status=200)

    if request.method == "GET":
        routing_table = ConfigRouting.objects.all()
        dns = ConfigNetwork.objects.get(pk=1).server_dns1
        dns_is_set = any(
            (dns in table.ip and '255.255.255.255' in table.mask for table in routing_table)
        )

        routing_table_serialized = json.loads(serializers.serialize('json', routing_table))
        response = json.dumps(
            {
                'routing': [table['fields'] for table in routing_table_serialized],
                'dns': dns_is_set
            }
        )
        return HttpResponse(response, content_type="application/json")


def vpn_cert_info(request):
    if not request.user.is_authenticated() and request.user.username != "RutokenVpn":
        return HttpResponse(
            'Unauthorized',
            status=401
        )
    exec_paths = executables_path.EXEC_PATHS
    if request.method == "GET":
        if environment.is_demo_mode():
            return JsonResponse(
            {
                'needRequest': True,
                'timeDelta': 20,
                'startdate':  datetime.now().strftime('%b %d %H:%M:%S %Y %Z'),
                'enddate': datetime.now().strftime('%b %d %H:%M:%S %Y %Z'),
                'serial': 1,
                'fingerprint': 2
            })

        vpnserver_cert_path = os.path.join(exec_paths.PKI_ISSUED_FOLDER,   "vpnserver.crt")

        #pylint: disable=no-member
        vpn_cert = pki_methods.get_certificate_enddate(
            vpnserver_cert_path,
            exec_paths.OPENSSL,
            True
        ).decode()

        vpn_cert = vpn_cert.split('\n')
        serial = vpn_cert[0].replace('serial=', '')
        finger_print = vpn_cert[1].replace('SHA1 Fingerprint=', '')
        cert_startdate = vpn_cert[2].replace('notBefore=', '')
        cert_enddate = vpn_cert[3].replace('notAfter=', '')
        parsed_cert_startdate = datetime.strptime(cert_startdate, '%b %d %H:%M:%S %Y %Z')
        parsed_cert_enddate = datetime.strptime(cert_enddate, '%b %d %H:%M:%S %Y %Z')

        need_to_request_new_cert = False

        now = datetime.utcnow()
        time_delta = (parsed_cert_enddate - now).days

        if time_delta < 30:
            need_to_request_new_cert = True

        return JsonResponse(
            {
                'needRequest': need_to_request_new_cert,
                'timeDelta': time_delta,
                'startdate': parsed_cert_startdate,
                'enddate': parsed_cert_enddate,
                'serial': serial,
                'fingerprint': finger_print
            })
    elif request.method == "POST":
        if environment.is_demo_mode():
            return HttpResponse(status=200, content_type="application/json")
        pkey_type = ConfigPki.objects.get(pk=1).pki_type
        pki_methods.revoke(exec_paths.PKI_SERVER_CERT, executables_path.EXEC_PATHS.OPENSSL, True)
        pki_methods.gen_crl(
            executables_path.EXEC_PATHS.PKI_CRL_FILE,
            executables_path.EXEC_PATHS.OPENSSL,
            True
        )
        pki_methods.generate_req(
            pkey_type,
            exec_paths.PKI_SERVER_REQ,
            exec_paths.PKI_SERVER_KEY,
            exec_paths.OPENSSL,
            "vpnserver",
            True
        )
        pki_methods.sign_req_with_ca(
            exec_paths.PKI_SERVER_REQ,
            exec_paths.PKI_SERVER_CERT,
            "server_exts",
            exec_paths.OPENSSL,
            True
        )
        pki_methods.gen_crl(
            executables_path.EXEC_PATHS.PKI_CRL_FILE, executables_path.EXEC_PATHS.OPENSSL, True
        )
        os.system('sudo systemctl restart openvpn@openvpn')
        return HttpResponse(status=200, content_type="application/json")
    else:
        return HttpResponseBadRequest()
