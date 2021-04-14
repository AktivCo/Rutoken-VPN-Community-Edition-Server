"""
status controller module
"""
import json

from datetime import datetime
from django.core import serializers
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

from vpnserver.models import TaskStatus
from vpnserver.users_helper import get_users_list
from vpnserver.helpers import set_taskstatus_init
from vpnserver.identity_helper import is_authenticated
from vpnserver import environment


def identity(request):
    if is_authenticated(request):
        name = request.user.username
        user = None
        if name in 'RutokenVpn':
            user = json.dumps(
                {
                    'username': request.user.username,
                    'isDemoMode': environment.is_demo_mode()
                })
        else:
            user = json.dumps(get_users_list(name))

        return HttpResponse(user, content_type="application/json")
    else:
        return HttpResponse('Unauthorized', status=401)


def init_status(request):
    if is_authenticated(request):
        try:
            task_list = TaskStatus.objects.get(pk=1)
            data = serializers.serialize('json', [task_list])
            struct = json.loads(data)
            data = json.dumps(struct[0]["fields"])
            response = data
            return HttpResponse(response, content_type="application/json")
        except: #pylint: disable=bare-except
            return JsonResponse({'type': 0, 'status': 0})
    else:
        return HttpResponse('Unauthorized', status=401)


def set_task_init(request) :
    if is_authenticated(request) and request.user.username == "RutokenVpn":
        try:
            set_taskstatus_init()
            return HttpResponse(status=200,content_type="application/json")
        except: #pylint: disable=bare-except
            return HttpResponseBadRequest()
    else:
        return HttpResponse('Unauthorized', status=401)


def check_time(request): #pylint: disable=unused-argument
    """
    checking sever time and send it to /api/checktime
    """
    now = datetime.utcnow()
    return JsonResponse(
        {
            'servertime': str(now),
            "unixtime": int((now - datetime(1970, 1, 1)).total_seconds())
        }
    )
