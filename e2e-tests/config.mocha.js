describe('config', function () {
    before(function (browser, done) {
        browser.page.config().load();
        browser.perform(() => done());
    });

    after(function (browser, done) {
        browser.end(() => done());
    });

    afterEach(function (browser, done) {
        done();
    });

    beforeEach(function (browser, done) {
        done();
    });

    it.only('can switch locale', function (browser) {
        var page = browser.page.config();

        page.waitForEnglishLocale()
            .selectLocale("ru")
            .waitForRussianLocale();
    });
});
