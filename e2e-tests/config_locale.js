module.exports = {
    'open page': function (browser) {
        browser.url(browser.launchUrl + '/config');
    },
    'About has splash-screen': function (browser) {
        browser.waitForElementVisible('#splash', 1000);
    },
    'wait for ready': function (browser) {
        browser.waitForElementVisible('#footer', 1000);
    },
    'check we have english locale': function (browser) {
        browser.assert.containsText(".navbar-nav li.active", "Config");
    },
    'config can select locale': function (browser) {
        browser
            .assert.visible(".config-locale-input")
            .click('select.config-locale-input option[value="ru"]');
    },
    'check we have russian locale': function (browser) {
        browser.useXpath().waitForElementVisible('//ul[contains(@class, "navbar-nav")]/li[contains(@class, "active")]//*[contains(text(), "Настройки")]', 1000).useCss();
    },
    'end': function (browser) {
        browser.end();
    }
};
