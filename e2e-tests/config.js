module.exports = {
    before(browser) {
        browser.page.config().load();
    },

    'can switch locale'(browser) {
        var page = browser.page.config();

        page.waitForEnglishLocale()
            .selectLocale("ru")
            .waitForRussianLocale();

    },
    after(browser) {
        browser.end();
    }
};
