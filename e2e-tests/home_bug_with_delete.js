module.exports = {
    'open page': function (browser) {
        browser
            .url(browser.launchUrl + '/home')
            .waitForElementVisible('#footer', 1000);
    },
    'add passes': function (browser) {
        browser
            .setValue('.pass-adder .title-input', 'first title')
            .setValue('.pass-adder .user-input', 'first user')
            .setValue('.pass-adder .pass-input', 'test password123')
            .click('.pass-adder .btn-pass-add')
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'first title')]", 1000).useCss()
            .clearValue('.pass-adder .title-input')
            .setValue('.pass-adder .title-input', 'second title')
            .clearValue('.pass-adder .user-input')
            .setValue('.pass-adder .user-input', 'second user')
            .clearValue('.pass-adder .pass-input')
            .setValue('.pass-adder .pass-input', 'test password321')
            .click('.pass-adder .btn-pass-add')
            .useXpath().waitForElementVisible("//div[contains(@class, 'pass-list')]//td[contains(text(), 'second title')]", 1000).useCss();
    },
    'remove first pass': function (browser) {
        browser
            .useXpath().click("//tr[td[contains(text(), 'first title')]]/td/button[contains(@class, 'btn-pass-remove')]").useCss()
            .useXpath().waitForElementNotPresent("//tr[td[contains(text(), 'first title')]]", 1000).useCss();
    },
    'refresh all passes': function (browser) {
        browser
            .click('.btn-refresh-all-pass')
            .waitForElementVisible('.toast-success', 1000);
    },
    'check that we dont have first pass and do have second pass': function (browser) {
        browser
            .useXpath().verify.elementNotPresent("//div[contains(@class, 'pass-list')]//td[contains(text(), 'first title')]").useCss()
            .useXpath().verify.elementPresent("//div[contains(@class, 'pass-list')]//td[contains(text(), 'second title')]").useCss();
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
