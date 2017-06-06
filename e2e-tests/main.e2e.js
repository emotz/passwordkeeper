describe('main', function () {
    browser.windowHandleSize({ width: 1920, height: 1080 });

    describe('login', function () {
        const Page = require('./po/page.js');
        const page = new Page();

        beforeEach(function () {
            page.open();
        });

        it('should fail login with non-existent user/password', function () {
            page.login('nonexistent user', 'nonexistent password');
            page.waitForFailedLogin();
        });
        it('should not fail login with correct user/password and logout', function () {
            page.login('myuser', 'mypassword');
            page.waitForLogoutReady();
            page.logout();
            page.waitForLoginReady();
        });
    });
    describe('about', function () {
        const page = require('./po/about.js');

        it('should contain app title', function () {
            page.open();

            expect(page.body.getText()).toContain("Password Keeper");
        });
    });
    describe('config', function () {
        const page = require('./po/config.js');

        it('can switch locale', function () {
            page.open();
            page.waitForEnglishLocale();

            page.selectLocale("ru");
            page.waitForRussianLocale();
            page.selectLocale("en");

            page.waitForEnglishLocale();
        });
    });

    describe('home', function () {
        const page = require('./po/home.js');

        beforeEach(function () {
            page.open();
            page.removeAllPasses();
            page.waitForNoPasses();
        });

        afterEach(function () {
            page.waitForNoPasses();
        });

        it('can add and remove pass', function () {
            let pass = {
                title: 'test title',
                user: 'test user',
                password: 'test password'
            };

            page.addPass(pass);
            page.waitForPass(pass);
            page.removeLastPass();
            page.waitForPass(pass, undefined, true);
        });
        it('bug with delete', function () {
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

            page.addPass(pass1);
            page.addPass(pass2);
            page.waitForPass(pass1);
            page.removePass(pass1);
            page.refreshAllPasses();
            page.waitForPass(pass1, undefined, true);
            page.waitForPass(pass2);
            page.removeLastPass();
        });
        it('can edit', function () {
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

            page.addPass(pass);
            page.editLastPass(updatedPass);
            page.waitForPass(updatedPass);
            page.waitForPass(pass, undefined, true);
            page.removeLastPass();
        });
        it('can search', function () {
            let pass = {
                title: 'test title',
                user: 'test user',
                password: 'test password'
            };
            let passing_query = "tit";
            let failing_query = "lalala";

            page.addPass(pass);
            page.searchPass(passing_query);
            page.waitForPass(pass);
            page.searchPass(failing_query);
            page.waitForNoPasses();
            page.searchPass("");
            page.waitForPass(pass);
            page.removeLastPass();
        });
    });
});