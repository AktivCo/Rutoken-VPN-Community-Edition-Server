import { Component, OnInit } from '@angular/core';
import browserDetect from 'browser-detect';
import { HttpClientService } from '../../services/httpclient';
import { DynamicComponent } from '../../services/dynamic-component.class';

import { PluginHelper, PluginLoadErrors, PluginLoad } from './plugin.helper.class';

import * as supportedBrowsers from './supportedBrowsers.json';
import * as supportedBrowserCheck from './supportedBrowsers';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const rutoken = require('rutoken');

const CURRENT_PLUGIN_VERSION = '4.0.1.0';

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
};

const getSupportedPlatforms = (): Array<any> => {
    const supportedPlatforms: any[] = [];

    Object.keys(supportedBrowsers).forEach((platform) => supportedPlatforms.push(platform));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return supportedPlatforms;
};

const getSupportedOs = (): Array<any> => {
    const supportedOs: any[] = [];

    Object.keys(supportedBrowsers).forEach((platform: string) => {
        Object.keys(supportedBrowsers[platform]).forEach((os: string) => supportedOs.push(os));
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return supportedOs;
};

const getSupportedBrowsersForOs = (platform: string, os: string): Array<string> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const supportedPlatforms = supportedBrowsers[platform];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const supportedBrowsersForCurrentPlatform = supportedPlatforms[os];

    const browsers = Object.keys(supportedBrowsersForCurrentPlatform);

    return browsers;
};

@Component({
    templateUrl: 'plugin.component.html',
})
export class PluginComponent extends DynamicComponent implements OnInit {
    constructor(private httpClient: HttpClientService) {
        super();
    }

    username: any;

    error: string;

    plugin: any;

    pkeyType: string;

    pluginHelper: PluginHelper;

    browserDetect: any;

    browser: any;

    deviceList: Array<any> = [];

    viewStepsStatus: any = viewStepsStatus;

    supportedBrowsers: any;

    viewSteps: {
        step: number;
        statusText: string;
        additionalStatusText: string;
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

    setViewStep(step: number, statusText: string, additionalStatusText = ''): void {
        this.viewSteps = {
            step,
            statusText,
            additionalStatusText,
        };
    }

    ngOnInit(): void {
        this.setViewStep(viewStepsStatus.INIT, 'Загружаем Рутокен Плагин');

        if (!this.data) this.closeModal();

        this.browserDetect = browserDetect();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.supportedBrowsers = JSON.parse(JSON.stringify(supportedBrowsers));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.browser = supportedBrowserCheck.GetCurrentBrowser(window.navigator.userAgent);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.username = this.data.username;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.pkeyType = this.data.pkeyType;
        this.viewStepsStatus = viewStepsStatus;
        this.pluginHelper = new PluginHelper();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Promise.resolve(rutoken.ready)
            .then(() => supportedBrowserCheck.IsCurrentBrowserSupported(this.supportedBrowsers))
            .then((result: any) => {
                if (!result) return supportedBrowserCheck.ThrowSupportException(false, false);

                return supportedBrowserCheck.NeedToCheckInstalledExtension(this.supportedBrowsers);
            })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            .then((result: any) => (result ? rutoken.isExtensionInstalled() : true))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            .then((result: any) => (result ? rutoken.isPluginInstalled() : supportedBrowserCheck.ThrowSupportException()))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            .then((result: any) => (result ? rutoken.loadPlugin() : supportedBrowserCheck.ThrowSupportException(false)))
            // eslint-disable-next-line consistent-return
            .then((plugin: any) => {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                if (typeof plugin === 'undefined') throw new PluginLoad(PluginLoadErrors.NO_LOAD);

                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (plugin.version <= CURRENT_PLUGIN_VERSION) {
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw new PluginLoad(PluginLoadErrors.NO_VERSION);
                }

                const check = supportedBrowserCheck.CheckIfSupported(
                    supportedBrowserCheck.GetSupportedBrowsersByPluginVersion(
                        this.supportedBrowsers,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        plugin.version,
                    ),
                );

                if (!check) return supportedBrowserCheck.ThrowSupportException(false, false);

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this.plugin = plugin;
                this.getDeviceList();
            })
            .catch((error: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
                if (error.hasOwnProperty('browser')) {
                    const supportedPlatforms = getSupportedPlatforms();

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const currentPlatformIndex = supportedPlatforms.findIndex((p) => p === error.os.type);

                    if (currentPlatformIndex !== -1) {
                        const supportedOs = getSupportedOs();

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        const currentOsIndex = supportedOs.findIndex((br) => br === error.platform.name);

                        if (currentOsIndex !== -1) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            const osBrowsers = getSupportedBrowsersForOs(error.os.type, error.platform.name);

                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            const currentBrowserIndex = osBrowsers.findIndex((br) => br === error.browser.name);

                            if (currentBrowserIndex !== -1) {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                if (error.needExtension) {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, max-depth
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
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                if (error.needPlugin) {
                                    this.setViewStep(
                                        viewStepsStatus.INSTALL_PLUGIN,
                                        'Установите Рутокен Плагин',
                                        'Для подготовки USB-токенов Рутокен ЭЦП, установите дополнительное программное обеспечение для браузера.',
                                    );
                                    return;
                                }
                                this.setViewStep(viewStepsStatus.BROWSER_IS_NOT_SUPPORTED, 'Поддерживаемые браузеры');
                                return;
                            }
                            this.setViewStep(viewStepsStatus.BROWSER_IS_NOT_SUPPORTED, 'Поддерживаемые браузеры');
                            return;
                        }
                        this.setViewStep(viewStepsStatus.BROWSER_IS_NOT_SUPPORTED, 'Поддерживаемые браузеры');
                        return;
                    }
                    this.setViewStep(viewStepsStatus.BROWSER_IS_NOT_SUPPORTED, 'Поддерживаемые браузеры');
                    return;
                }
                if (error instanceof PluginLoad) {
                    switch (error.error) {
                        case PluginLoadErrors.NO_LOAD:
                            this.setViewStep(viewStepsStatus.ERROR, 'Ошибка  Рутокен Плагин');
                            break;
                        case PluginLoadErrors.NO_VERSION:
                            this.setViewStep(
                                viewStepsStatus.UPDATE_PLUGIN,
                                'Обновите Рутокен Плагин',
                                "Версия установленного в системе 'Рутокен Плагин' не совпадает с актуальной.",
                            );
                            break;
                        default:
                            this.setViewStep(viewStepsStatus.ERROR, 'Ошибка  Рутокен Плагин');
                    }
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

    checkOsByShortName = (osName: string): void =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        supportedBrowserCheck.GetCurrentOsName().toLowerCase().includes(osName);
}
