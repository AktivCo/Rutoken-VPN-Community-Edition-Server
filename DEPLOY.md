Деплой сервера

<ul>
<li>Загрузите последние изменения в репозиторий проекта на сервер системы контроля версий</li>

<li>Перейдите в папку проекта</li>

<li> Добавите пользователя с именем "ubuntu" от которого будет произведена установка:

    grep -q "^ubuntu:" /etc/group || groupadd "ubuntu"
    grep -q "^ubuntu:" /etc/passwd || useradd "ubuntu" -N -G users --create-home -s /bin/bash
    usermod -a -G "ubuntu" "ubuntu" || exit 2
    usermod -a -G "sudo" "ubuntu"
</li>
<li>Запустите с правами superuser скрипт, передав опционально URL удаленного репозитория и название ветки, с которой будет происходить сборка сервера:

    sudo -s

    bash install.sh https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Server.git public
</li>
Где https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Server.git - адрес репозитория. Опциональный параметр;

public - название ветки. Опциональный параметр;

Если не указать параметры, то скрипт автоматически будет использовать код с удаленного репозитория по адресу https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Server.git  и ветки public.

В процессе работы скрипта - Ввести логин и пароль к репозиторию (если потребуется)

После перезагрузки сервис "поднимется" автоматически
</ul>