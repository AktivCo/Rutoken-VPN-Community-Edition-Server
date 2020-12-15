// eslint-disable-next-line no-shadow
export enum PluginLoadErrors {
    NO_EXTENSION,
    NO_PLUGIN,
    NO_LOAD,
    NO_VERSION,
    NO_PLATFORM,
}

export class PluginLoad {
    private _error: any;

    constructor(errorCode: PluginLoadErrors) {
        this._error = errorCode;
    }

    get error(): PluginLoadErrors {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._error;
    }
}
export class PluginHelper {
    private getTemplate = () => {
        const model = {
            id: 0,
            name: 'Стандартный',
            template: {
                subject: [
                    {
                        rdn: 'commonName',
                        value: '',
                        text: 'commonName',
                        readonly: false,
                    },
                    {
                        rdn: 'surname',
                        value: '',
                        text: 'Фамилия',
                        readonly: false,
                    },
                    {
                        rdn: 'givenName',
                        value: '',
                        text: 'Имя/отчество',
                        readonly: false,
                    },
                    {
                        rdn: 'pseudonym',
                        value: '',
                        text: 'Псевдоним',
                        readonly: false,
                    },
                    {
                        rdn: 'INN',
                        value: '',
                        text: 'ИНН',
                        readonly: false,
                    },
                    {
                        rdn: 'SNILS',
                        value: '',
                        text: 'СНИЛС',
                        readonly: false,
                    },
                    {
                        rdn: 'emailAddress',
                        value: '',
                        text: 'Электронная почта',
                        readonly: false,
                    },
                    {
                        rdn: 'organizationName',
                        value: '',
                        text: 'Организация',
                        readonly: false,
                    },
                    {
                        rdn: 'OGRN',
                        value: '',
                        text: 'ОГРН',
                        readonly: false,
                    },
                    {
                        rdn: 'OGRNIP',
                        value: '',
                        text: 'ОГРНИП',
                        readonly: false,
                    },
                    {
                        rdn: 'organizationalUnitName',
                        value: '',
                        text: 'Подразделение',
                        readonly: false,
                    },
                    {
                        rdn: 'title',
                        value: '',
                        text: 'Должность',
                        readonly: false,
                    },
                    {
                        rdn: 'countryName',
                        value: 'RU',
                        text: 'Страна',
                        readonly: false,
                    },
                    {
                        rdn: 'stateOrProvinceName',
                        value: 'Москва',
                        text: 'Субъект федерации',
                        readonly: false,
                    },
                    {
                        rdn: 'localityName',
                        value: 'Москва',
                        text: 'Населенный пункт',
                        readonly: false,
                    },
                    {
                        rdn: 'streetAddress',
                        value: '',
                        text: 'Адрес',
                        readonly: false,
                    },
                    {
                        rdn: 'postalAddress',
                        value: '',
                        text: 'Почтовый адрес',
                        readonly: false,
                    },
                ],
                extensions: {
                    keyUsage: [
                        {
                            oid: 'digitalSignature',
                            enabled: true,
                            text: 'Цифровая подпись',
                        },
                        {
                            oid: 'nonRepudiation',
                            enabled: true,
                            text: 'Неотрекаемость',
                        },
                        {
                            oid: 'dataEncipherment',
                            enabled: false,
                            text: 'Шифрование данных',
                        },
                        {
                            oid: 'keyEncipherment',
                            enabled: false,
                            text: 'Шифрование ключей',
                        },
                        {
                            oid: 'keyAgreement',
                            enabled: false,
                            text: 'Обмен ключами',
                        },
                        {
                            oid: 'keyCertSign',
                            enabled: false,
                            text: 'Подпись сертификатов',
                        },
                        {
                            oid: 'cRLSign',
                            enabled: false,
                            text: 'Подпись списков отзыва',
                        },
                    ],
                    extKeyUsage: [
                        {
                            oid: 'emailProtection',
                            enabled: true,
                            text: 'Защита электронной почты',
                        },
                        {
                            oid: 'clientAuth',
                            enabled: false,
                            text: 'Аутентификация клиента',
                        },
                        {
                            oid: '1.2.643.2.2.34.6',
                            enabled: false,
                            text: 'Пользователь центра регистрации КриптоПро',
                        },
                        {
                            oid: '1.2.643.3.7.0.1.12',
                            enabled: false,
                            text: 'Сертификат сроком на 12 месяцев',
                            readonly: false,
                        },
                        {
                            oid: '1.2.643.3.7.8.1',
                            enabled: false,
                            text: 'Квалифицированный сертификат',
                            readonly: false,
                        },
                    ],
                    certificatePolicies: [
                        {
                            oid: '1.2.643.100.113.1',
                            enabled: true,
                            text: 'KC 1',
                        },
                        {
                            oid: '1.2.643.100.113.2',
                            enabled: false,
                            text: 'KC 2',
                        },
                        {
                            oid: '1.2.643.100.113.3',
                            enabled: false,
                            text: 'KC 3',
                        },
                        {
                            oid: '1.2.643.100.113.4',
                            enabled: false,
                            text: 'KB 1',
                        },
                        {
                            oid: '1.2.643.100.113.5',
                            enabled: false,
                            text: 'KB 2',
                        },
                        {
                            oid: '1.2.643.100.113.6',
                            enabled: false,
                            text: 'KA 1',
                        },
                    ],
                },
            },
        };
        return model;
    };

    public getSubject(commonName: string): Array<unknown> {
        const { template } = this.getTemplate();
        const subject = new Array<any>();

        for (let l = template.subject.length - 1; l >= 0; l -= 1) {
            if (template.subject[l].rdn === 'commonName') {
                template.subject[l].value = commonName;
            }

            if (template.subject[l].value !== '') {
                subject.push({ rdn: template.subject[l].rdn, value: template.subject[l].value });
            }
        }
        return subject;
    }

    public getExtensions(): unknown {
        const { template } = this.getTemplate();

        const extensions: any = {
            keyUsage: new Array<any>(),
            extKeyUsage: new Array<any>(),
            certificatePolicies: new Array<any>(),
        };

        for (let l1 = template.extensions.keyUsage.length - 1; l1 >= 0; l1 -= 1) {
            if (template.extensions.keyUsage[l1].enabled) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                extensions.keyUsage.push(template.extensions.keyUsage[l1].oid);
            }
        }

        for (let l2 = template.extensions.extKeyUsage.length - 1; l2 >= 0; l2 -= 1) {
            if (template.extensions.extKeyUsage[l2].enabled) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                extensions.extKeyUsage.push(template.extensions.extKeyUsage[l2].oid);
            }
        }

        for (let l3 = template.extensions.certificatePolicies.length - 1; l3 >= 0; l3 -= 1) {
            if (template.extensions.certificatePolicies[l3].enabled) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                extensions.certificatePolicies.push(template.extensions.certificatePolicies[l3].oid);
            }
        }

        return extensions;
    }
}
