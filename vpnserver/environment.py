import os
from django.conf import settings

def is_demo_mode():
    return settings.IS_DEMO_MODE
