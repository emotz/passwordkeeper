describe('main', function () {

    after(function (browser, done) {
        browser.end(() => done());
    });

    describe('about', function () {
        before(function (browser, done) {
            browser.page.about().load();
            browser.perform(() => done());
        });

        afterEach(function (browser, done) {
            done();
        });

        beforeEach(function (browser, done) {
            done();
        });

        it('should contain app title', function (browser) {
            var page = browser.page.about();

            page.assert.containsText('body', 'Password Keeper');
        });
    });

    describe('config', function () {
        before(function (browser, done) {
            browser.page.config().load();
            browser.perform(() => done());
        });

        afterEach(function (browser, done) {
            done();
        });

        beforeEach(function (browser, done) {
            done();
        });

        it('can switch locale', function (browser) {
            var page = browser.page.config();

            page.waitForEnglishLocale()
                .selectLocale("ru")
                .waitForRussianLocale();
        });
    });
});