Для запуска сервиса управления на машине разработчика, необходимо:

Подключиться к репозиторию и переключиться на целевую ветку.  
Установить Pyenv. (для OS X через homebrew)  
Поставить python версии 3.6.0:  pyenv install 3.6.0 (проект и зависимости работают с этой версии)
Для ubuntu 20.04 eсли при выполнении данной команды возникла ошибка, BUILD FAILED (Ubuntu 20.04 using python-build 1.2.21-5-gdb939bbc), выполнить команду:  
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev.  
Подробнее https://stackoverflow.com/a/43418906  
Установить дефолтную версию для python - pyenv global 3.6.0.  
cd rutokenvepn-server (перейти в корень проекта)  
pyenv exec python -m venv venv (в проекте в папку venv устанавливаем виртуальное окружение с python 3.6.0)  
source venv/bin/activate - активация виртуального окружения python.  
Установка:  
python -m pip install django==1.9.6  
python -m pip install requests==2.10.0  
python -m pip install ldap3==1.2.2  
python -m pip install celery==3.1.23  
python -m pip install kombu==3.0.35  

Создание базы:  
mkdir db  
python manage.py makemigrations vpnserver  
python manage.py migrate  

Установка nodejs  
Установить nodejs по инструкции: https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/  
а) sudo apt-get install curl  
b) curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -  
c) sudo apt-get install nodejs  

Сборка фронта   
npm run webpack:opensource  

Запуск линтера для бекэнда

Установить pylint
python -m pip install pylint

Запуск линтера
pylint ./**/*.py

Запуск проекта  
python manage.py runserver  
