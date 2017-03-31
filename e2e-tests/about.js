module.exports = {
    before(browser) {
        browser.page.about().load();
    },
    'contains app title'(browser) {
        var page = browser.page.about();

        page.assert.containsText('body', 'Password Keeper');
    },
    after(browser) {
        browser.end();
    }
};
