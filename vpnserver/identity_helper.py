
"""
Identity helper module
"""

def is_authenticated(request):
    return request.user.is_authenticated


def is_admin(request):
    return request.user.username == "RutokenVpn"
