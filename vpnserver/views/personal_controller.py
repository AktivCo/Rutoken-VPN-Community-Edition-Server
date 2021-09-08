"""
personal controller module
"""
import json
import os
import time

from urllib.parse import quote
from django.http import HttpResponse, HttpResponseBadRequest

from vpnserver import environment
from vpnserver.models import (
    ConfigSettings,
    ConfigNetwork,
    ConfigVpn,
    ConfigPki,
)
from vpnserver.identity_helper import is_authenticated

from pkiapi import executables_path, pki_methods, config_methods


def vpn_getclientvpnconf(request):
    if time.time() < 1458893516.0:  # check time
        return HttpResponseBadRequest()
    if not is_authenticated(request):
        return HttpResponse('Unauthorized', status=401)
    if request.method != "GET":
        return HttpResponseBadRequest()

    if environment.is_demo_mode():
        response_client_name = quote('test.ovpn')
        response = HttpResponse("this is test config")
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = (
            u'attachment; filename*=UTF-8\'\'%s' % response_client_name
        )
        response['Content-Transfer-Encoding'] = 'binary'
        response['Accept-Range'] = 'bytes'

        return response

    os.system("sudo chown -R ubuntu:ubuntu %s" % executables_path.EXEC_PATHS.VPN_FOLDER)

    server_dns          = None
    ldap_base_dn        = None
    client_cert_path    = None
    client_key_path     = None
    config_vpn = ConfigVpn.objects.get(pk=1)

    if ConfigNetwork.objects.exists():
        server_dns = ConfigNetwork.objects.get(pk=1).server_dns1
    if ConfigSettings.objects.exists():
        ldap_base_dn = ConfigSettings.objects.get(pk=1).ldap_base_dn
    name = str(request.GET.get("clientname"))
    encodedname = name.encode('utf-8').strip()
    client_name = encodedname.decode('utf-8')

    if "rutokenVpnClient" not in client_name:
        client_cert_path = os.path.join(
            executables_path.EXEC_PATHS.PKI_ISSUED_FOLDER,  "%s.crt" % client_name
        )
        client_key_path  = os.path.join(
            executables_path.EXEC_PATHS.PKI_PRIVATE_FOLDER, "%s.key" % client_name
        )

    pkey_type = ConfigPki.objects.get(pk=1).pki_type
    client_config = config_methods.create_client_config(
        pkey_type,
        config_vpn.external_ip,
        executables_path.EXEC_PATHS.PKI_CA_CERT,
        executables_path.EXEC_PATHS.PKI_DH_FILE,
        executables_path.EXEC_PATHS.PKI_TA_KEY_FILE,
        client_cert_path,
        client_key_path,
        ldap_base_dn,
        server_dns
    )

    os.system("sudo chown -R root:root %s" % executables_path.EXEC_PATHS.VPN_FOLDER)

    username_cert, timestamp, cert_client_type = client_name.rsplit("_", 2)
    str_arr = "_".join([username_cert, cert_client_type])
    client_file_name = str_arr + ".ovpn"
    response_client_name = quote(client_file_name)
    response = HttpResponse(client_config)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = u'attachment; filename*=UTF-8\'\'%s' % response_client_name
    response['Content-Transfer-Encoding'] = 'binary'
    response['Accept-Range'] = 'bytes'

    return response


def personal(request):
    """
    Generates user certs
    """
    if not is_authenticated(request):
        return HttpResponse('Unauthorized', status=401)

    if request.method != "POST":
        return HttpResponseBadRequest()

    if time.time() < 1458893516.0:  # check time
        return HttpResponseBadRequest()

    exec_paths = executables_path.EXEC_PATHS
    name_from_req = str(request.POST.get("name"))
    encodedname = name_from_req.encode('utf-8').strip()
    name = encodedname.decode('utf-8')

    can_generate_cert_on_token = True
    can_generate_mobile_cert = True

    if hasattr(request.user, 'cert_access'):
        can_generate_mobile_cert = request.user.cert_access.can_generate_mobile_cert
        can_generate_cert_on_token = request.user.cert_access.can_generate_cert_on_token

    if request.POST.get("cert_req"):
        if not can_generate_cert_on_token:
            return HttpResponse('Unauthorized', status=401)
        if environment.is_demo_mode():
            return HttpResponse(status=200, content_type="application/json")

        cert_req = str(request.POST.get("cert_req"))
        os.system("sudo chown -R ubuntu:ubuntu %s" % executables_path.EXEC_PATHS.VPN_FOLDER)

        cert_file_path    = os.path.join(exec_paths.PKI_ISSUED_FOLDER, "%s.crt" % name)
        req_file_path     = os.path.join(exec_paths.PKI_REQS_FOLDER,   "%s.req" % name)
        with open(req_file_path, 'w') as file:
            file.write(cert_req)

        pki_methods.sign_req_with_ca(
            req_file_path,
            cert_file_path,
            "client_exts",
            exec_paths.OPENSSL,
            True
        )
        with open(cert_file_path, 'r') as file:
            cert_file = file.read()
            cert_file = cert_file[cert_file.find("-----BEGIN CERTIFICATE-----"):]
            print(cert_file)
        date = json.dumps(str(cert_file))
        os.system("sudo chown -R root:root %s" % executables_path.EXEC_PATHS.VPN_FOLDER)

        return HttpResponse(date, content_type="application/json")

    if not request.POST.get("cert_req"):
        if not can_generate_mobile_cert:
            return HttpResponse('Unauthorized', status=401)

        if environment.is_demo_mode():
            return HttpResponse(status=200, content_type="application/json")
        pkey_type = ConfigPki.objects.get(pk=1).pki_type

        pki_methods.generate_req(pkey_type,
            os.path.join(exec_paths.PKI_REQS_FOLDER,    "%s.req" % name),
            os.path.join(exec_paths.PKI_PRIVATE_FOLDER, "%s.key" % name),
            exec_paths.OPENSSL,
            name,
            True
        )
        pki_methods.sign_req_with_ca(
            os.path.join(exec_paths.PKI_REQS_FOLDER,    "%s.req" % name),
            os.path.join(exec_paths.PKI_ISSUED_FOLDER,  "%s.crt" % name),
            "client_exts",
            exec_paths.OPENSSL,
            True
        )

        return HttpResponse(status=200, content_type="application/json")
