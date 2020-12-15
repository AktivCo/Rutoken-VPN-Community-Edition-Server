import json

from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist, ValidationError



def signin(request):
    if request.method == "POST":
        login = request.POST.get("login")
        password = request.POST.get("password")
        try:
            user = auth.authenticate(username=login, password=password)
        except ValidationError:
            return HttpResponse(json.dumps({'error': True, 'message': "Отсутствует соединение с доменом"}), status=200)

        if user is not None:
            auth.login(request, user)
            return HttpResponse(json.dumps({'error': False}), status=200)
        else:
            return HttpResponse(json.dumps({'error': True, 'message': "Неверный логин или пароль"}), status=200)
    else:
        try:
            User.objects.get(pk=1)
        except ObjectDoesNotExist:
            return HttpResponse(
                json.dumps({'error': True, 'message': "Для входа используйте логин и пароль RutokenVpn"}),
                status=200)
        else:
            return HttpResponse(json.dumps({'error': False}), status=200)


def signout(request):
    if request.user.is_authenticated():
        auth.logout(request)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=200)
