module.exports = {
    'open page': function (browser) {
        browser
            .url(browser.launchUrl + '/home')
            .waitForElementVisible('#footer', 1000);
    },
    'Home has add button': function (browser) {
        browser.waitForElementVisible('.pass-adder .btn-pass-add', 1000);
    },
    'Home can add pass': function (browser) {
        browser
            .setValue('.pass-adder .title-input', 'test title')
            .setValue('.pass-adder .user-input', 'test user')
            .setValue('.pass-adder .pass-input', 'test password')
            .click('.pass-adder .btn-pass-add')
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'test title')]", 1000).useCss();
    },
    'Home can remove pass': function (browser) {
        browser
            .useXpath().click("//tr[td[contains(text(), 'test title')]]/td/button[contains(@class, 'btn-pass-remove')]").useCss()
            .useXpath().waitForElementNotPresent("//tr[td[contains(text(), 'test title')]]", 1000).useCss();
    },
    'end': function (browser) {
        browser.end();
    }
};
