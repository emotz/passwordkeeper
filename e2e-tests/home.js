module.exports = {
    'can add and remove pass'(browser) {
        let page = browser.page.home();

        page.load()
            .addPass({
                title: 'test title',
                user: 'test user',
                password: 'test password'
            })
            .removeLastPass()
            .assertNoPasses();

        browser.end();
    },
    'bug with delete'(browser) {
        let page = browser.page.home();

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

        page.load()
            .addPass(pass1)
            .addPass(pass2)
            .removePass(pass1)
            .refreshAllPasses()
            .assertNotContainsPass(pass1)
            .assertContainsPass(pass2)
            .removeLastPass()
            .assertNoPasses();

        browser.end();
    },
    'can edit'(browser) {
        let page = browser.page.home();

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

        page.load()
            .addPass(pass)
            .editLastPass(updatedPass)
            .refreshAllPasses()
            .assertContainsPass(updatedPass)
            .assertNotContainsPass(pass)
            .removeLastPass()
            .assertNoPasses();

        browser.end();
    }
};
