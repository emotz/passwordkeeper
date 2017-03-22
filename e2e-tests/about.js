module.exports = {
    'open page': function (browser) {
        browser.url(browser.launchUrl + '/about');
    },
    'About has splash-screen': function (browser) {
        browser.waitForElementVisible('#splash', 1000);
    },
    'wait for ready': function (browser) {
        browser.waitForElementVisible('#footer', 1000);
    },
    'About has greeting': function (browser) {
        browser.assert.containsText('body', 'Password Keeper')
    },
    'end': function (browser) {
        browser.end();
    }
};
