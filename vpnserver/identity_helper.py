
"""
Identity helper module
"""

def is_authenticated(request):
    return request.user.is_authenticated()
    