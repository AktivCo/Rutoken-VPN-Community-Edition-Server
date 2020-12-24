#!/bin/bash

PROJECT_NAME=Rutoken-VPN-Community-Edition-Server
ROOT_PROJECT_PATH=/opt/$PROJECT_NAME

sed -i s/\GRUB_CMDLINE_LINUX=\"\/GRUB_CMDLINE_LINUX=\"net.ifnames=0\ \/ /etc/default/grub
update-grub

apt-get update
apt-get install -y git python3-pip curl openvpn wget supervisor nginx
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get update
apt-get install -y nodejs
cd /opt
git clone https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Server.git
cd $ROOT_PROJECT_PATH
git checkout public
python3 -m pip install django==1.9.6
python3 -m pip install requests==2.10.0
python3 -m pip install ldap3==1.2.2
python3 -m pip install celery==3.1.23 
python3 -m pip install kombu==3.0.35
python3 -m pip install gunicorn==19.4.5
mkdir db
python3 manage.py makemigrations vpnserver
python3 manage.py migrate
export NG_CLI_ANALYTICS=off
npm install &&  npm run webpack:opensource
mkdir /etc/openvpn
wget https://www.openssl.org/source/openssl-1.1.0f.tar.gz
tar xzvf openssl-1.1.0f.tar.gz
cd openssl-1.1.0f
./config -Wl,--enable-new-dtags,-rpath,'$(LIBRPATH)'
make
sudo make install
openssl version -a
cd $ROOT_PROJECT_PATH
chown -R  ubuntu:ubuntu $ROOT_PROJECT_PATH


cat > /etc/nginx/sites-enabled/default <<EOF
server {
  listen 80;
    location /static {
       alias $ROOT_PROJECT_PATH/vpnserver/static/;
    }
    location /media {
        alias /var/log/openvpn;
    }
    location / {
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8000;
        proxy_redirect default;

    }
}

EOF

cat > /etc/supervisor/conf.d/celery.conf <<EOF
[program:celery]
command=celery -A vpnserver worker --loglevel=info
directory=$ROOT_PROJECT_PATH/
user=ubuntu
numprocs=1
autostart=true
autorestart=true
startsecs=10
stopwaitsecs = 600
killasgroup=true
priority=998
environment=OPENVPN_BIN=/usr/sbin/openvpn, OPENVPN="/etc/openvpn",OPENSSL=/usr/local/bin/openssl,OPENSSL_CONF="$ROOT_PROJECT_PATH/Vpn/config/openssl.cnf",LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8,LC_LANG=en_US.UTF-8

EOF

cat > /etc/supervisor/conf.d/gunicorn.conf <<EOF
[program:gunicorn]
command=gunicorn Vpn.wsgi --bind 127.0.0.1:8000 --chdir $ROOT_PROJECT_PATH/
process_name=%(process_num)s
user=ubuntu
numprocs=1
redirect_stderr=true
autostart=true
autorestart=true
startsecs=5
environment=OPENVPN_BIN=/usr/sbin/openvpn, OPENVPN="/etc/openvpn",OPENSSL=/usr/local/bin/openssl,OPENSSL_CONF="$ROOT_PROJECT_PATH/Vpn/config/openssl.cnf", LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8,LC_LANG=en_US.UTF-8

EOF

update-rc.d supervisor enable
update-rc.d supervisor defaults

touch /etc/iptables.rules

mkdir -p /etc/openvpn/ccd
if [ $(cat /proc/sys/net/ipv4/ip_forward) = "0" ]; then echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf; fi
echo 'Defaults env_keep += "OPENVPN OPENSSL OPENSSL_CONF"' | (EDITOR="tee -a" visudo)
echo "ubuntu  ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers 

sed -i s/\IS_DEMO_MODE\ =\ True\/IS_DEMO_MODE\ =\ False\/ $ROOT_PROJECT_PATH/Vpn/settings.py

sudo init 6
