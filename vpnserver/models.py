"""
Models
"""
import random
import string
from django.db import models
from django.contrib.auth.models import User


# Create your models here.

def key_generator():
    """
    Random Key generator
    """
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(100))

# pylint: disable=too-few-public-methods
class ConfigSettings (models.Model):
    """
    Data for Rutoken Vpn server settings
    """
    TYPE = (("r", "rsa"),)
    server_key = models.CharField("Ключ сервера OpenVpn", max_length=100, default="")
    domain_server = models.CharField("Адрес контроллера домена", max_length=255)
    name = models.CharField("Пользователь для подлючения к AD", max_length=255, default="")
    password = models.CharField("Пароль пользователя", max_length=255, default="")
    ldap_base_dn = models.CharField(
        "Основное имя домена", max_length=255, default="dc=example,dc=com"
        )
    server_type = models.CharField(max_length=1, choices=TYPE, default="r")

# pylint: disable=too-few-public-methods
class ConfigNetwork (models.Model):
    MODE = (("a", "auto"),
            ("m", "manual"))  # network mode
    box_guid = models.CharField("Box guid", max_length=100)
    server_ip = models.CharField("Ip адрес сервера", max_length=15)
    server_mask = models.CharField("Маска подсети", max_length=15, default="255.255.255.0")
    server_gate = models.CharField("Адрес шлюза подсети", max_length=15)
    server_dns1 = models.CharField("DNS сервера #1", max_length=31)
    server_dns2 = models.CharField("DNS сервера #2", max_length=31, null=True)
    server_eth_mode = models.CharField(max_length=1, choices=MODE)

# pylint: disable=too-few-public-methods
class TaskStatus (models.Model):

    INIT = 0
    STARTED = 1
    FINISHED = 2
    #system types
    NONE_TYPE = 0
    PKI_TYPE = 1
    UPDATE_TYPE = 2
    REBOOT_TYPE = 3

    STATUS_CHOICES = (
        (INIT, 'init'),
        (STARTED, 'started'),
        (FINISHED, 'finished')
    )
    #type choices
    TYPE_CHOICES = (
        (PKI_TYPE, 'pki'),
        (UPDATE_TYPE, 'update')
    )
    status = models.IntegerField(choices=STATUS_CHOICES, default=INIT)
    type = models.IntegerField(choices=TYPE_CHOICES, default=NONE_TYPE)
    description = models.CharField('Status description', max_length=100, null=True)

# pylint: disable=too-few-public-methods
class ConfigVpn (models.Model):
    """
    Data for Rutoken Vpn server settings
    """
    server_name = models.CharField(
        'Внешний "белый" IP адрес сервера', max_length=15
    ) # 255 - max allowed length for a domain name
    cipher = models.CharField("Шифрование", max_length=50, default="BF-CBC")
    external_ip = models.CharField('Внешний "белый" IP адрес сервера', max_length=15)

# pylint: disable=too-few-public-methods
class ConfigPki (models.Model):
    """
    Data for Rutoken Vpn server settings
    """
    common_name = models.CharField("CompanyName", max_length=50, default="RutokenVpn")
    pki_type = models.CharField("Тип PKI", max_length=50, default="rsa")

# pylint: disable=too-few-public-methods
class ConfigNtp (models.Model):
    """
    Data for Rutoken Vpn server settings
    """
    ntp_server = models.CharField("NtpServer", max_length=50, null=True)
# pylint: disable=too-few-public-methods
class ConfigRouting (models.Model):
    """
    Data for Rutoken Vpn routing settigns
    """
    ip = models.CharField("value_one", max_length=50, default="")
    mask = models.CharField("value_two", max_length=50, default="")

# pylint: disable=too-few-public-methods
class ConfigLogs (models.Model):
    """
    Data for Rutoken Vpn logs settigns
    """
    is_enabled = models.BooleanField("is_enabled", default=False)
    level = models.IntegerField("level", default=3)

# pylint: disable=too-few-public-methods
class AccessToCertGeneration(models.Model):
    user = models.OneToOneField(
        User,
        verbose_name='Пользователь',
        on_delete=models.CASCADE,
        related_name='cert_access'
    )
    can_generate_mobile_cert = models.BooleanField(
        verbose_name='Может генерировать мобильный сертификат',
        default=True
    )
    can_generate_cert_on_token = models.BooleanField(
        verbose_name='Может генерировать сертификат на токене',
        default=True
    )
    is_disabled = models.BooleanField(
        verbose_name='Заблокирован',
        default=False
    )
