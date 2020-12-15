export class OPERATIONS {
    public static readonly ROUTE_LINK = 'operations';

    public static readonly ROUTE_LINK_NAME = 'Операции';
}

export class ADMPWD {
    public static readonly ROUTE_LINK = 'adminpwd';

    public static readonly ROUTE_LINK_NAME = 'Пароль администратора';
}

export class TIME {
    public static readonly ROUTE_LINK = 'time';

    public static readonly ROUTE_LINK_NAME = 'Настройка времени';
}



export class LOGS {
    public static readonly ROUTE_LINK = 'logs';

    public static readonly ROUTE_LINK_NAME = 'Логи';
}

export class DEVICE {
    public static readonly ROUTE_LINK = 'device';

    public static readonly CHILDS = { ADMPWD, TIME, OPERATIONS, LOGS };
}

export class NETWORK {
    public static readonly ROUTE_LINK = 'network';

    public static readonly ROUTE_LINK_NAME = 'Настройка сети';
}
export class CA {
    public static readonly ROUTE_LINK = 'ca';

    public static readonly ROUTE_LINK_NAME = 'Центр сертификации';
}
export class VPN {
    public static readonly ROUTE_LINK = 'vpn';

    public static readonly ROUTE_LINK_NAME = 'Настройка VPN';
}
export class VPNCERT {
    public static readonly ROUTE_LINK = 'vpncert';

    public static readonly ROUTE_LINK_NAME = 'Сертификат VPN сервера';
}
export class AD {
    public static readonly ROUTE_LINK = 'ad';

    public static readonly ROUTE_LINK_NAME = 'Настройка Active Directory';
}

export class SYSTEM {
    public static readonly ROUTE_LINK = 'system';

    public static readonly CHILDS = { NETWORK, CA, VPN, VPNCERT, AD };
}

export class LIST {
    public static readonly ROUTE_LINK = 'list';

    public static readonly ROUTE_LINK_NAME = 'Список пользователей';
}
export class CERTS {
    public static readonly ROUTE_LINK = 'certs';

    public static readonly ROUTE_LINK_NAME = 'Сертификаты пользователей';
}
export class CONNECTED {
    public static readonly ROUTE_LINK = 'connected';

    public static readonly ROUTE_LINK_NAME = 'Подключенные пользователи';
}
export class USERS {
    public static readonly ROUTE_LINK = 'users';

    public static readonly CHILDS = { LIST, CERTS, CONNECTED };
}

export class ROUTING_DEFINITION {
    public static readonly ROUTE_LINK = 'manage';

    public static readonly CHILDS = { USERS, SYSTEM, DEVICE };
}
