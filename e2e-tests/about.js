module.exports = {
    'About has splash-screen': function (browser) {
        browser
            .url(browser.launchUrl + '/about')
            .waitForElementVisible('#splash', 1000)
            .end();
    },
    'About has greeting': function (browser) {
        browser
            .url(browser.launchUrl + '/about')
            .waitForElementVisible('#footer', 1000)
            .assert.containsText('body', 'Password Keeper')
            .end();
    }
};
