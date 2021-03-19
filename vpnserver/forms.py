"""
Environment module
"""
from django import forms


#pylint: disable=line-too-long
class ConfigForm(forms.Form):
    TYPE = (("r", "RSA"))

    # server_type = forms.ChoiceField(choices=TYPE,
    #                                label="Тип сервера",
    #                                widget=forms.Select(attrs={'class': 'form-control'}))


    common_name = forms.CharField(label="Компания",
                                  widget=forms.TextInput(attrs={'class': 'form-control',
                                                                'initial-value': '',
                                                                'placeholder': 'Введите название компании',
                                                                'ng-required': 'true',
                                                                'ng-maxlength': '30',
                                                                'ng-model': 'common_name'}))

    server_name = forms.CharField(label="Доменное имя сервера RutokenVPN, или Ip адрес",
                                  widget=forms.TextInput(attrs={'class': 'form-control',
                                                                'initial-value': '',
                                                                'placeholder': 'Введите DNS имя или IP сервера',
                                                                'ng-pattern': '/^[a-zA-Z0-9.-]+$/',
                                                                'ng-required': 'true',
                                                                'ng-maxlength': '63',
                                                                'ng-model': 'server_name'}))

    domain_server = forms.CharField(label="Адрес контроллера домена",
                                    widget=forms.TextInput(attrs={'class': 'form-control',
                                                                  'initial-value': '',
                                                                  'placeholder': 'Введите IP адрес контроллера домена',
                                                                  'ip-input': '',
                                                                  'ng-maxlength': '15',
                                                                  'ng-required': 'true',
                                                                  'ng-model': 'domain_server'}))

    ldap_base_dn = forms.CharField(label="Основное имя домена",
                                   widget=forms.TextInput(attrs={'class': 'form-control',
                                                                 'initial-value': '',
                                                                 'placeholder': 'Введите имя домена в формате example.com ',
                                                                 'domainname-input': '',
                                                                 'ng-maxlength': '63',
                                                                 'ng-required': 'true',
                                                                 'ng-model': 'ldap_base_dn'}))


class ConfigNetForm(forms.Form):
    MODE = (("m", "Статическая"),
            ("a", "DHCP"))

    server_eth_mode = forms.CharField(widget=forms.HiddenInput(attrs={'class': 'form-control',
                                                                   'initial-value': '',
                                                                   'ng-model': "server_eth_mode",
                                                                   'tag': forms.HiddenInput()}))

    server_ip = forms.CharField(label="IP адрес сервера",
                                widget=forms.TextInput(attrs={'class': 'form-control',
                                                              'initial-value': '',
                                                              'ip-input': '',
                                                              'ng-required': 'true',
                                                              'ng-model': 'server_ip'}))

    server_mask = forms.CharField(label="Маска подсети",
                                  widget=forms.TextInput(attrs={'class': 'form-control',
                                                                'initial-value': '',
                                                                'ip-input': '',
                                                                'ng-required': 'true',
                                                                'ng-model': 'server_mask'}))

    server_gate = forms.CharField(label="Адрес шлюза подсети",
                                  widget=forms.TextInput(attrs={'class': 'form-control',
                                                                'initial-value': '',
                                                                'ip-input': '',
                                                                'ng-required': 'true',
                                                                'placeholder': 'Введите Ip адрес шлюза подсети',
                                                                'ng-model': 'server_gate'}))
    server_dns1 = forms.CharField(label="DNS сервер 1",
                                 widget=forms.TextInput(attrs={'class': 'form-control',
                                                               'initial-value': '',
                                                               'ng-required': 'true',
                                                               'ng-model': 'server_dns1',
                                                               'ip-input': ''}))

    server_dns2 = forms.CharField(label="DNS сервер 2 (опционально)",
                                  required = False,
                                  widget=forms.TextInput(attrs={'class': 'form-control',
                                                               'initial-value': '',
                                                               'ng-required': 'false',
                                                               'ng-model': 'server_dns2',
                                                               'ip-input': ''}))


class ChangeAdminPass(forms.Form):
    password1 = forms.CharField(label="Пароль",
                                widget=forms.TextInput(attrs={'class': 'form-control',
                                                              'placeholder': 'Введите новый пароль',
                                                              'type': 'password',
                                                              'ng-maxlength': '40',
                                                              'ng-required': 'true',
                                                              'ng-model': 'password1'}))
    password2 = forms.CharField(label="Подтвердите пароль",
                                widget=forms.TextInput(attrs={'class': 'form-control',
                                                              'placeholder': 'Введите новый пароль еще раз',
                                                              'type': 'password',
                                                              'ng-maxlength': '40',
                                                              'ng-required': 'true',
                                                              'pw-check': '',
                                                              'yh-match': 'password1',
                                                              'ng-model': 'password2'}))
