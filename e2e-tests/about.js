module.exports = {
    'contains app title'(browser) {
        var page = browser.page.about();

        page.load()
            .assert.containsText('body', 'Password Keeper');

        browser.end();
    }
};
