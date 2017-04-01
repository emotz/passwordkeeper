let base = require('./base.js');

module.exports = new base({
    url: '/home',
    commands: {
        addPass(pass) {
            this
                .clearValue('@adderTitleInput').setValue('@adderTitleInput', pass.title)
                .clearValue('@adderUserInput').setValue('@adderUserInput', pass.user)
                .clearValue('@adderPasswordInput').setValue('@adderPasswordInput', pass.password)
                .click('@adderAddBtn')
                .assertContainsPass(pass);

            return this;
        },
        searchPass(query) {
            this.expect.element('@searchInput').to.be.visible.after();
            if (query === "") {
                // HACK: clearValue doesnt trigger event so we manually adding a 'a' and deleting it right away to trigger search
                this.clearValue('@searchInput').setValue('@searchInput', ["a", this.api.Keys.BACK_SPACE]);
            } else {
                this.clearValue('@searchInput').setValue('@searchInput', query);
            }

            return this;
        },
        editLastPass(pass) {
            this.expect.element('@lastPassEntryEditBtn').to.be.enabled.after();
            this.click('@lastPassEntryEditBtn');
            this.expect.element(".pk-pass-editor .pk-title-input").to.be.visible.after();
            this
                .clearValue('.pk-pass-editor .pk-title-input')
                .setValue('.pk-pass-editor .pk-title-input', pass.title)
                .clearValue('.pk-pass-editor .pk-user-input')
                .setValue('.pk-pass-editor .pk-user-input', pass.user)
                .clearValue('.pk-pass-editor .pk-pass-input')
                .setValue('.pk-pass-editor .pk-pass-input', pass.password)
                .click('@editorOkBtn');
            this.expect.element('.pk-pass-editor').to.not.be.visible.after();
            this.assertContainsPass(pass);
            return this;
        },
        removePass(pass) {
            let xpath_title = `//tr[td[contains(text(), '${pass.title}')]]`;
            let xpath = xpath_title + "/td/button[contains(@class, 'pk-btn-pass-remove')]";
            this.api
                .useXpath()
                .waitForElementVisible(xpath)
                .click(xpath)
                .waitForElementNotPresent(xpath_title)
                .useCss();

            return this;
        },
        removeLastPass() {
            this.expect.element('@lastPassEntryRemoveBtn').to.be.visible.after();
            return this.click('@lastPassEntryRemoveBtn');
        },
        refreshAllPasses() {
            this.click('@refreshAllBtn');
            this.api
                .useXpath()
                .waitForElementVisible('//div[contains(@class, "toast-success")]//*[contains(text(), "Items fetched.")]')
                .useCss();

            return this;
        },
        assertContainsPass(pass) {
            xpath = `//tr[td[contains(text(), '${pass.title}')]]`;
            this.api
                .useXpath()
                .waitForElementVisible(xpath)
                .useCss();

            return this;
        },
        assertNotContainsPass(pass) {
            this.expect.element('@passEntries').text.not.to.contain(pass.title).after();
            return this;
        },
        assertNoPasses() {
            this.expect.element('@passEntries').not.to.be.present.after();
            return this;
        }
    },
    elements: {
        searchInput: '.pk-pass-filter-input',
        lastPassEntry: '.pk-pass-list tbody tr:last-child',
        lastPassEntryRemoveBtn: '.pk-pass-list tbody tr:last-child .pk-btn-pass-remove',
        lastPassEntryEditBtn: '.pk-pass-list tbody tr:last-child .pk-btn-pass-edit',
        passEntries: '.pk-pass-list tbody tr',
        passEntriesRemoveBtn: '.pk-pass-list tbody tr .pk-btn-pass-remove',
        adderTitleInput: '.pk-pass-adder .pk-title-input',
        adderUserInput: '.pk-pass-adder .pk-user-input',
        adderPasswordInput: '.pk-pass-adder .pk-pass-input',
        adderAddBtn: '.pk-pass-adder .pk-btn-pass-add',
        refreshAllBtn: '.pk-btn-refresh-all-pass',
        editorOkBtn: '.pk-pass-editor .pk-btn-editor-ok'
    }
});
