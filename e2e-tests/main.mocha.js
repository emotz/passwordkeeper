describe('main', function () {

    after(function (browser, done) {
        browser.end(() => done());
    });

    describe('about', function () {
        let page;

        before(function (browser, done) {
            page = browser.page.about().load();
            browser.perform(() => done());
        });

        it('should contain app title', function (browser) {
            page.assert.containsText('body', 'Password Keeper');
        });
    });

    describe('config', function () {
        let page;

        before(function (browser, done) {
            page = browser.page.config().load();
            browser.perform(() => done());
        });

        after(function (browser, done) {
            page.selectLocale("en");
            browser.perform(() => done());
        });

        it('can switch locale', function (browser) {
            page.waitForEnglishLocale()
                .selectLocale("ru")
                .waitForRussianLocale();
        });
    });

    describe('home', function () {
        let page;

        before(function (browser, done) {
            page = browser.page.home().load();
            browser.perform(() => done());
        });

        it('can add and remove pass', function (browser) {
            page.addPass({
                title: 'test title',
                user: 'test user',
                password: 'test password'
            })
                .removeLastPass()
                .assertNoPasses();
        });
        it('bug with delete', function (browser) {
            let pass1 = {
                title: 'first title',
                user: 'first user',
                password: 'first password'
            };
            let pass2 = {
                title: 'second title',
                user: 'second user',
                password: 'second password'
            };

            page.addPass(pass1)
                .addPass(pass2)
                .removePass(pass1)
                .refreshAllPasses()
                .assertNotContainsPass(pass1)
                .assertContainsPass(pass2)
                .removeLastPass()
                .assertNoPasses();
        });
        it('can edit', function (browser) {
            let pass = {
                title: 'test title',
                user: 'test user',
                password: 'test password'
            };

            let updatedPass = {
                title: 'updated title',
                user: 'updated user',
                password: 'updated password'
            };

            page.addPass(pass)
                .editLastPass(updatedPass)
                .refreshAllPasses()
                .assertContainsPass(updatedPass)
                .assertNotContainsPass(pass)
                .removeLastPass()
                .assertNoPasses();
        });
    });
});