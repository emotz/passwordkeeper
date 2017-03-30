module.exports = {
    'can switch locale'(browser) {
        var page = browser.page.config();

        page.load()
            .waitForEnglishLocale()
            .selectLocale("ru")
            .waitForRussianLocale();

        browser.end();
    }
};
