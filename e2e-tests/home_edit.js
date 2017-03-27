module.exports = {
    'open page': function (browser) {
        browser
            .url(browser.launchUrl + '/home')
            .waitForElementVisible('#footer', 1000);
    },
    'wait': function (browser) {
        browser.waitForElementVisible('.pass-adder .btn-pass-add', 1000);
    },
    'add pass': function (browser) {
        browser
            .setValue('.pass-adder .title-input', 'test title')
            .setValue('.pass-adder .user-input', 'test user')
            .setValue('.pass-adder .pass-input', 'test password')
            .click('.pass-adder .btn-pass-add')
            .pause(600)
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'test title')]", 1000).useCss();
    },
    'edit pass': function (browser) {
        browser
            .useXpath().click("//tr[td[contains(text(), 'test title')]]/td/button[contains(@class, 'btn-pass-edit')]").useCss()
            .waitForElementVisible(".pass-editor .title-input", 1000)
            .clearValue('.pass-editor .title-input')
            .setValue('.pass-editor .title-input', 'new title')
            .useXpath().click("//div[contains(@class, 'pass-editor')]//button[contains(text(), 'OK')]").useCss()
            .pause(600)
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'new title')]", 1000).useCss()
            .useXpath().verify.elementNotPresent("//div[contains(@class, 'pass-list')]//td[contains(text(), 'test title')]").useCss();
    },
    'refresh all passes': function (browser) {
        browser
            .click('.btn-refresh-all-pass')
            .waitForElementVisible('.toast-success', 1000);
    },
    'check that we still have edited entry': function (browser) {
        browser
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'new title')]", 1000).useCss()
            .useXpath().verify.elementNotPresent("//div[contains(@class, 'pass-list')]//td[contains(text(), 'test title')]").useCss();
    },
    'clear out': function (browser) {
        browser
            .click('.btn-pass-remove')
            .pause(1000);
    },
    'end': function (browser) {
        browser.end();
    }
};
