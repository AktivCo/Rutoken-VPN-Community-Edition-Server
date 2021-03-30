/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Component, OnInit } from '@angular/core';

import Plugin from '@aktivco-it/rutoken-plugin-bootstrap/src/index';
import {
    NoSupportOsError,
    NoSupportBrowserError,
    NoSupportPlatformError,
    NoInstalledPluginError,
    NoSupportBrowserVersionError,
    NoSupportPluginVersionError,
} from '@aktivco-it/rutoken-plugin-bootstrap/src/supportError';

import { HttpClientService } from '../../services/httpclient';
import { DynamicComponent } from '../../services/dynamic-component.class';
import { PluginHelper } from './plugin.helper.class';

const viewStepsStatus = {
    ERROR: -1,
    INIT: 0,
    DEVICE_LIST: 1,
    PKCS10_REQUEST: 2,
    CERTREQ_FINISHED: 3,

    INSTALL_CHROME_ADAPTER: 10,
    INSTALL_FIREFOX_ADAPTER: 11,
    INSTALL_OPERA_ADAPTER: 12,
    INSTALL_PLUGIN: 13,
    UPDATE_PLUGIN: 14,
    BROWSER_IS_NOT_SUPPORTED: 15,
    INSTALL_SAFARI_PLUGIN: 16,
    INSTALL_EDGE_ADAPTER: 16,
    NO_PLATFORM_SUPPORT: 17,
    NO_OS_SUPPORT: 18,
    BROWSER_VERSION_IS_NOT_SUPPORTED: 19,
};

@Component({
    templateUrl: 'plugin.component.html',
})
export class PluginComponent extends DynamicComponent implements OnInit {
    constructor(private httpClient: HttpClientService) {
        super();
    }

    username: any;

    plugin: any;

    pluginError: any;

    pkeyType: string;

    pluginHelper: PluginHelper;

    deviceList: Array<any> = [];

    viewStepsStatus: any = viewStepsStatus;

    viewSteps: {
        step: number;
        statusText: string;
        additionalStatusText: string;
        data?: any;
    };

    private static getDeviceInfo(deviceNumber: number, plugin: any): Promise<any> {
        const dev = { model: '', label: '', serial: '', isPinCached: '' };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const p1 = plugin.getDeviceInfo(deviceNumber, plugin.TOKEN_INFO_MODEL);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const p2 = plugin.getDeviceInfo(deviceNumber, plugin.TOKEN_INFO_LABEL);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const p3 = plugin.getDeviceInfo(deviceNumber, plugin.TOKEN_INFO_SERIAL);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const p4 = plugin.getDeviceInfo(deviceNumber, plugin.TOKEN_INFO_IS_PIN_CACHED);

        return Promise.all([p1, p2, p3, p4]).then(
            (values) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring
                dev.model = values[0];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring
                dev.label = values[1];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring
                dev.serial = values[2];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring
                dev.isPinCached = values[3];
                return dev;
            },
            () => {},
        );
    }

    // eslint-disable-next-line class-methods-use-this
    resetEnterPin(item: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
        item.pinError = undefined;
    }

    setViewStep(step: number, statusText: string, additionalStatusText = '', data = {}): void {
        this.viewSteps = {
            step,
            statusText,
            additionalStatusText,
            data,
        };
    }

    ngOnInit(): void {
        this.setViewStep(viewStepsStatus.INIT, 'Загружаем Рутокен Плагин');

        if (!this.data) this.closeModal();

        let sequence = Promise.resolve();

        this.plugin = Plugin;

        if (!Plugin.valid) {
            sequence = sequence.then(() => Plugin.init())
        }

        sequence = sequence.then(() => this.getDeviceList());

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.username = this.data.username;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.pkeyType = this.data.pkeyType;
        this.viewStepsStatus = viewStepsStatus;
        this.pluginHelper = new PluginHelper();

        sequence.catch((error: any) => {
            this.pluginError = error;

            if (error instanceof NoSupportPlatformError) {
                this.setViewStep(viewStepsStatus.NO_PLATFORM_SUPPORT, 'Ваша операционная система не подходит для установки Рутокен плагина. Центр сертификации Рутокен работает только на настольных платформах.');
                return;
            }

            if (error instanceof NoSupportOsError || error.os.name === 'Linux') { //Linux is supported by plugin but not by app
                this.setViewStep(viewStepsStatus.NO_OS_SUPPORT, 'Ваша операционная система не подходит для установки Рутокен плагина.');
                return;
            }

            if (error instanceof NoSupportBrowserError || error instanceof NoSupportBrowserVersionError) {
                this.setViewStep(viewStepsStatus.BROWSER_IS_NOT_SUPPORTED, 'Поддерживаемые браузеры');
                return;
            }

            if (error instanceof NoInstalledPluginError) {
                if (!error.needExtension) {
                    this.setViewStep(
                        viewStepsStatus.INSTALL_PLUGIN,
                        'Установите Рутокен Плагин',
                        'Для подготовки USB-токенов Рутокен ЭЦП, установите дополнительное программное обеспечение для браузера.',
                    );
                    return;
                }

                switch (error.browser.name) {
                    case 'Firefox':
                    case 'Internet Explorer':
                        this.setViewStep(
                            viewStepsStatus.INSTALL_FIREFOX_ADAPTER,
                            'Установите Рутокен Плагин и включите Адаптер',
                            `Для подготовки USB-токенов Рутокен ЭЦП, необходимо установить Рутокен Плагин и включить дополнение
                            'Адаптер Рутокен Плагин' в настройках браузера. (CTRL+SHIFT+A)`,
                        );
                        break;
                    case 'Opera':
                        this.setViewStep(
                            viewStepsStatus.INSTALL_OPERA_ADAPTER,
                            'Установите Адаптер Рутокен Плагин',
                            "Для подготовки USB-токенов Рутокен ЭЦП, необходимо установить и включить дополнение 'Адаптер Рутокен Плагин' в настройках браузера.",
                        );
                        break;
                    case 'Microsoft Edge':
                        this.setViewStep(
                            viewStepsStatus.INSTALL_EDGE_ADAPTER,
                            'Установите Адаптер Рутокен Плагин',
                            "Для подготовки USB-токенов Рутокен ЭЦП, необходимо установить и включить дополнение 'Адаптер Рутокен Плагин' в настройках браузера.",
                        );
                        break;
                    case 'Chrome':
                    case 'Yandex Browser':
                    case 'SputnikBrowser':
                        this.setViewStep(
                            viewStepsStatus.INSTALL_CHROME_ADAPTER,
                            'Установите Адаптер Рутокен Плагин',
                            "Для подготовки USB-токенов Рутокен ЭЦП, необходимо установить и включить дополнение 'Адаптер Рутокен Плагин' в настройках браузера.",
                        );
                        break;
                    case 'Safari':
                        this.setViewStep(
                            viewStepsStatus.INSTALL_SAFARI_PLUGIN,
                            'Установите Рутокен Плагин',
                            'Если Плагин уже установлен, убедитесь, что расширение "Адаптер Рутокен Плагин" включено.',
                        );
                        break;
                    default:
                        this.setViewStep(viewStepsStatus.ERROR, 'Ошибка Рутокен Плагин');
                }
                return;
            }

            if (error instanceof NoSupportPluginVersionError) {
                this.setViewStep(
                    viewStepsStatus.UPDATE_PLUGIN,
                    'Обновите Рутокен Плагин',
                    "Версия установленного в системе 'Рутокен Плагин' не совпадает с актуальной.",
                );
                return;
            }

            this.setViewStep(viewStepsStatus.ERROR, 'Ошибка  Рутокен Плагин');
        });
    }

    getDeviceList(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        Promise.resolve(this.plugin.enumerateDevices())
            .then((deviceNumbers: Array<any>) => Promise.all(deviceNumbers.map((dev) => PluginComponent.getDeviceInfo(dev, this.plugin))))
            .then((deviceList: Array<any>) => {
                this.deviceList = deviceList;
                this.setViewStep(viewStepsStatus.DEVICE_LIST, 'Выбор ключевого носителя');
            })
            .catch(() => {
                this.setViewStep(viewStepsStatus.ERROR, 'Ошибка  Рутокен Плагин');
            });
    }

    generatePkcs10(deviceId: number): void {
        const timestamp = Date.now();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const cn = `${this.username}_${timestamp}_rutokenVpnClient`;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const publicKeyAlgorithm = this.pkeyType.includes('gost')
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              this.plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2001
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            : this.plugin.PUBLIC_KEY_ALGORITHM_RSA;
        const signatureSize = this.pkeyType.includes('gost') ? 512 : 2048;
        const paramset = this.pkeyType.includes('gost') ? 'A' : '';

        const options = this.pkeyType.includes('gost')
            ? {
                  subjectSignTool: 'СКЗИ "РУТОКЕН ЭЦП"',
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  hashAlgorithm: this.plugin.HASH_TYPE_GOST3411_94,
              }
            : {
                  subjectSignTool: 'СКЗИ "РУТОКЕН ЭЦП"',
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  hashAlgorithm: this.plugin.HASH_TYPE_MD5,
              };

        this.setViewStep(viewStepsStatus.PKCS10_REQUEST, 'Выполнение необходимых операций', 'Генерируем ключевую пару...');

        Promise.resolve(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            this.plugin.generateKeyPair(deviceId, undefined, '', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                publicKeyAlgorithm,
                signatureSize,
                paramset,
            }),
        )
            .then((keyId: number) => {
                this.setViewStep(viewStepsStatus.PKCS10_REQUEST, 'Выполнение необходимых операций', 'Генерируем запрос PKCS10...');
                const subject = this.pluginHelper.getSubject(cn);
                const extensions = this.pluginHelper.getExtensions();

                return Promise.resolve(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    this.plugin.createPkcs10(deviceId, keyId, subject, extensions, options),
                );
            })
            .then((pkcs10: string) => {
                this.setViewStep(viewStepsStatus.PKCS10_REQUEST, 'Выполнение необходимых операций', 'Отправляем запрос PKCS10...');
                return this.httpClient.post('/api/personal', { cert_req: pkcs10, name: cn }).toPromise();
            })
            .then((certText) => {
                this.setViewStep(viewStepsStatus.PKCS10_REQUEST, 'Выполнение необходимых операций', 'Импортируем сертификат...');
                return Promise.resolve(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    this.plugin.importCertificate(deviceId, certText, this.plugin.CERT_CATEGORY_USER),
                );
            })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            .then((certid) => Promise.resolve(this.plugin.parseCertificate(deviceId, certid)))
            .then(() => this.setViewStep(viewStepsStatus.CERTREQ_FINISHED, 'Все готово'))
            .then(undefined, () => this.setViewStep(viewStepsStatus.ERROR, 'Ошибка  Рутокен Плагин'));
    }

    enterPin(deviceId: number, item: any): void {
        if (typeof deviceId === 'undefined') return;
        if (typeof item === 'undefined') return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        Promise.resolve(this.plugin.login(deviceId, item.pin))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            .then(() => Promise.resolve(this.plugin.savePin(deviceId)).then(() => this.getDeviceList()))
            .catch((error: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                switch (error.message) {
                    case '18':
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
                        item.pinError = 'PIN-код заблокирован';
                        break;
                    default:
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
                        item.pinError = 'Некорректный PIN-код';
                        break;
                }
            });
    }

    closeModal(): void {
        this.close.emit();
    }
}
