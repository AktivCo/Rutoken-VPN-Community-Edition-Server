"""
index controller module
"""
from django.shortcuts import render

def index(request):
    """
    Home view. Login Page for user
    :param request:
    :return:
    """
    return render(request, '__index__.html')
