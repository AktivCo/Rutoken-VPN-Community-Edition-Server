from django.conf.urls import url, include
from django.contrib import admin
from vpnserver import views
from django.conf import settings

urlpatterns = [
    # index_controller
    url(r'^$', views.index, name='index'),

    
    # status_controller

    url(r'^api/identity', views.identity, name='identity'),
    url(r'^api/initstatus', views.init_status, name='init_status'),
    url(r'^api/checktime', views.check_time, name='check_time'),
    url(r'^api/settaskinit', views.set_task_init, name='settaskinit'),

    # auth_controller
    url(r'^api/logout', views.signout, name='logout'),
    url(r'^api/login', views.signin, name='login'),

    # users_controller
    url(r'^api/users', views.users, name='users'),
    url(r'^api/listdomain', views.get_domainusers_list, name='domainusers'),
    url(r'^api/crl', views.vpn_config_crl, name='config_crl'),
    url(r'^api/connectedusers', views.vpn_config_connected_users, name='connected_users'),
    url(r'^api/disconnectuser', views.vpn_config_disconnect_user, name='disconnect_user'),
    url(r'^api/sync', views.sync_with_ad, name='sync_with_ad'),
    url(r'^api/cert_access', views.cert_access, name='forbid_generate_certs'),
    

    #system_controller
    url(r'^api/network', views.vpn_config_network, name='config_getnetwork'),
    url(r'^api/vpn', views.vpn_config_vpn, name='config_getvpn'),
    url(r'^api/domain', views.vpn_config_domain, name='config'),
    url(r'^api/pki', views.vpn_config_pki, name='config_pki'),
    url(r'^api/routing', views.vpn_config_routing, name='config_getrouting'),
    url(r'^api/certinfo', views.vpn_cert_info, name='vpn_cert_info'),
    # settings_controller
    url(r'^api/admpwd', views.vpn_config_admpwd, name='config_admpwd'),
    url(r'^api/settings', views.settings, name='settings'),
    url(r'^api/ntp', views.vpn_config_ntp, name='config_ntp'),
    url(r'^api/managebox', views.manage_box, name='manage_box'),

    # logs_controller
    url(r'^api/logs_enable', views.logs_enable, name='logs_enable'),
    url(r'^api/logs_list', views.get_logs_list, name='get_logs_list'),
    url(r'^api/clear_logs', views.clear_logs, name='clear_logs'),

    # personal_controller
    url(r'^api/personal', views.personal, name='personal'),
    url(r'^api/getclientvpnconf', views.vpn_getclientvpnconf, name='config_getclientvpnconf'),
]

# Admin panel for debug use
if settings.DEBUG:
    urlpatterns += [url(r'^admin/', include(admin.site.urls))]

urlpatterns += [url(r'^.*$', views.index, name='index')]
