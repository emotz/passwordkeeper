module.exports = {
    'Home has add button': function (browser) {
        browser
            .url(browser.launchUrl + '/home')
            .waitForElementVisible('#footer', 1000)
            .waitForElementVisible('.pass-adder .btn-pass-add', 1000)
            .end();
    },
    'Home can add and remove pass': function (browser) {
        browser
            .url(browser.launchUrl + '/home')
            .waitForElementVisible('#footer', 1000)
            .setValue('#title-input', 'test title')
            .setValue('#user-input', 'test user')
            .setValue('#pass-input', 'test password')
            .click('#pass-add')
            .pause(1000)
            .assert.containsText('.pass-list', "test title")
            .useXpath().click("//tr[td[contains(text(), 'test title')]]/td/button[contains(@class, 'btn-pass-remove')]")
            .useXpath().waitForElementNotPresent("//tr[td[contains(text(), 'test title')]]", 1000)
            .end();
    }
};
