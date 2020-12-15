const bowser = require('bowser/bundled');

var supportedBrowserCheck = (function () {
    var detectedBrowser = GetCurrentBrowser(window.navigator.userAgent);
    var currentBrowserName = detectedBrowser.getBrowser().name;
    var currentOsName = detectedBrowser.getOS().name;
    var currentPlatformName = detectedBrowser.getPlatform().type;

    function GetCurrentBrowser(userAgent) {
        let agent = bowser.getParser(userAgent);

        if (userAgent.includes('SputnikBrowser')) {
            agent.parsedResult.browser = {
                name: 'SputnikBrowser',
                version: userAgent.split('SputnikBrowser/')[1].split(' ')[0],
            };
        }

        return agent;
    }

    function GetCurrentOsName() {
        return currentOsName;
    }

    function SupportError(platform, os, browser, needExtension, needPlugin) {
        this.os = os;
        this.platform = platform;
        this.browser = browser;
        this.needExtension = needExtension;
        this.needPlugin = needPlugin;
    }

    function ThrowSupportException(needExtension = true, needPlugin = true) {
        throw new SupportError(
            detectedBrowser.getOS(),
            detectedBrowser.getPlatform(),
            detectedBrowser.getBrowser(),
            needExtension,
            needPlugin,
        );
    }

    var NeedToCheckInstalledExtension = function (browsers) {
        let result = true;

        Object.keys(browsers).forEach((platform) => {
            Object.keys(browsers[platform]).forEach((os) => {
                Object.keys(browsers[platform][os]).forEach((browser) => {
                    var version = browsers[platform][os][browser].reduce((previous, current) =>
                        previous.pluginVersion > current.pluginVersion ? previous : current,
                    ).pluginVersion;

                    let index = browsers[platform][os][browser].findIndex((b) => b.pluginVersion == version);

                    if (
                        browsers[currentPlatformName] != null &&
                        browsers[currentPlatformName][currentOsName] != null &&
                        browsers[currentPlatformName][currentOsName][currentBrowserName] != null
                    ) {
                        result = browsers[currentPlatformName][currentOsName][currentBrowserName][index].extensionCheck;
                    }
                });
            });
        });

        return result;
    };

    var CheckIfSupported = function (browsers) {
        const isValid = detectedBrowser.satisfies(browsers);

        if (isValid) return true;
        else return false;
    };

    var GetSupportedBrowsersByPluginVersion = function (browsers, version) {
        Object.keys(browsers).forEach((platform) => {
            Object.keys(browsers[platform]).forEach((os) => {
                Object.keys(browsers[platform][os]).forEach((browser) => {
                    let index = browsers[platform][os][browser].findIndex((b) => b.pluginVersion == version);

                    if (index == -1) {
                        if (browsers[platform][os][browser].length > 1) {
                            let supportedVersions = browsers[platform][os][browser].filter((br) => br.pluginVersion <= version);

                            let configVersion = supportedVersions.reduce((previous, current) =>
                                previous.pluginVersion < current.pluginVersion ? previous : current,
                            ).pluginVersion;

                            index = browsers[platform][os][browser].findIndex((b) => b.pluginVersion == configVersion);

                            Object.defineProperty(browsers[platform][os], browser, {
                                configurable: true,
                                enumerable: true,
                                writable: true,
                                value: browsers[platform][os][browser][index].browserSupportedVersions,
                            });
                        } else if ((browsers[platform][os][browser].length = 1)) {
                            let configVersion = browsers[platform][os][browser][0].pluginVersion;

                            if (version >= configVersion)
                                Object.defineProperty(browsers[platform][os], browser, {
                                    configurable: true,
                                    enumerable: true,
                                    writable: true,
                                    value: browsers[platform][os][browser][0].browserSupportedVersions,
                                });
                        } else ThrowSupportException(false, true);
                    } else
                        Object.defineProperty(browsers[platform][os], browser, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: browsers[platform][os][browser][index].browserSupportedVersions,
                        });
                });
            });
        });

        return browsers;
    };

    var IsCurrentBrowserSupported = function (browsers, version = null) {
        let result = {};

        Object.keys(browsers).forEach((platform) => {
            Object.keys(browsers[platform]).forEach((os) => {
                Object.keys(browsers[platform][os]).forEach((browser) => {
                    if (version == null)
                        version = browsers[platform][os][browser].reduce((previous, current) =>
                            previous.pluginVersion > current.pluginVersion ? previous : current,
                        ).pluginVersion;

                    let index = browsers[platform][os][browser].findIndex((b) => b.pluginVersion == version);

                    if (
                        browsers[currentPlatformName] != null &&
                        browsers[currentPlatformName][currentOsName] != null &&
                        browsers[currentPlatformName][currentOsName][currentBrowserName] != null
                    ) {
                        result[currentBrowserName] =
                            browsers[currentPlatformName][currentOsName][currentBrowserName][index].browserSupportedVersions;
                    }
                });
            });
        });

        return CheckIfSupported(result);
    };

    return {
        GetSupportedBrowsersByPluginVersion: GetSupportedBrowsersByPluginVersion,
        CheckIfSupported: CheckIfSupported,
        NeedToCheckInstalledExtension: NeedToCheckInstalledExtension,
        IsCurrentBrowserSupported: IsCurrentBrowserSupported,
        ThrowSupportException: ThrowSupportException,
        GetCurrentBrowser: GetCurrentBrowser,
        GetCurrentOsName: GetCurrentOsName,
    };
})();

if (typeof module !== 'undefined') {
    module.exports = supportedBrowserCheck;
}
