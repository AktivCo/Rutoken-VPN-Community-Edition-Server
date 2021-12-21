Рутокен VPN Community Edition (Рутокен VPN CE) основан на решении Рутокен VPN, разработанном компанией “Актив”, которое, в свою очередь, базируется на программном продукте OpenVPN. Open VPN реализует технологию VPN для создания зашифрованных каналов.

При создании продукта преследовались следующие цели:
<ul>
<li>	упростить настройку сервера и клиента, что позволяет быстро подготовить инфраструктуру для защищенного подключения к сети компании;</li>
<li>	внедрить двухфакторную аутентификацию, где в качестве фактора владения используются криптографические токены линейки Рутокен ЭЦП 2.0;</li>
<li>	обеспечить удобство пользователей: пользователи могут самостоятельно выполнять операции по настройке клиента с помощью портала самообслуживания, а для подключения к VPN им потребуется только запустить клиент, подключить один из совместимых устройств Рутокен и ввести PIN-код. </li>
</ul>
В интерфейсе управления представлены следующие основные функции:
<ul>
<li>Настройка сети;</li>
<li>Создание центра сертификации;</li>
<li>Настройка роутинга;</li>
<li>Обновление сертификата VPN-сервера; </li>
<li>Настройка интеграции с ActiveDirectory.</li>
</ul>
При этом большая часть возможностей по-прежнему доступна, но для их настройки используются конфигурационные файлы, которые можно менять непосредственно на сервере, а не в web-интерфейсе Рутокен VPN CE.

Существует коммерческая версия продукта - Рутокен VPN Enterprise.

Рутокен VPN Enterprise поставляется в виде виртуальной машины для распространённых систем виртуализации. В этом случае количество одновременно подключенных пользователей зависит только от вычислительной мощности предоставленной виртуальной машине.

Рутокен VPN Community Edition отличается от коммерческих версий тем, что:
<ul>
<li>Не представляется сервер обновлений;</li>
<li>Не предоставляется возможность использования шифрования с использованием криптографических алгоритмов ГОСТ Р 34.10-2012 и ГОСТ Р 34.12-2015.</li>
</ul>

********************************************************************************

Сервис предназначен для работы в Ubuntu 20.04. Для работы сервиса требуется Python 3.6.0. При развертке под другие операционные системы или отличные версии может потребоваться адаптация продукта и/или механизма настройки окружения.

Настройка окружения для развертки сервиса осуществляется посредством запуска скрипта install.sh, а так же смотрите описание в файле INSTALL для более подробной информации


********************************************************************************

Клиент для работы с сервисом можно скачать с сайта компании “Актив” - https://www.rutoken.ru/support/download/rutoken-vpn/

Также в GitHub доступен исходный код <a href="https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Client">Рутокен VPN Клиент Community Edition</a>

********************************************************************************

Руководство для разработчика вы можете найти в файле "Developer Guide.pdf"