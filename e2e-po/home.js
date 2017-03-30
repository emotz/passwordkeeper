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
        editLastPass(pass) {
            this.expect.element('@lastPassEntryEditBtn').to.be.enabled.after();
            this.click('@lastPassEntryEditBtn');
            this.expect.element(".pass-editor .title-input").to.be.visible.after();
            this
                .clearValue('.pass-editor .title-input')
                .setValue('.pass-editor .title-input', pass.title)
                .clearValue('.pass-editor .user-input')
                .setValue('.pass-editor .user-input', pass.user)
                .clearValue('.pass-editor .pass-input')
                .setValue('.pass-editor .pass-input', pass.password)
                .click('@editorOkBtn');
            this.expect.element('.pass-editor').to.not.be.visible.after();
            this.assertContainsPass(pass);
            return this;
        },
        removePass(pass) {
            let xpath_title = `//tr[td[contains(text(), '${pass.title}')]]`;
            let xpath = xpath_title + "/td/button[contains(@class, 'btn-pass-remove')]";
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
        lastPassEntry: '.pass-list tbody tr:last-child',
        lastPassEntryRemoveBtn: '.pass-list tbody tr:last-child .btn-pass-remove',
        lastPassEntryEditBtn: '.pass-list tbody tr:last-child .btn-pass-edit',
        passEntries: '.pass-list tbody tr',
        passEntriesRemoveBtn: '.pass-list tbody tr .btn-pass-remove',
        adderTitleInput: '.pass-adder .title-input',
        adderUserInput: '.pass-adder .user-input',
        adderPasswordInput: '.pass-adder .pass-input',
        adderAddBtn: '.pass-adder .btn-pass-add',
        refreshAllBtn: '.btn-refresh-all-pass',
        editorOkBtn: {
            locateStrategy: 'xpath',
            selector: "//div[contains(@class, 'pass-editor')]//button[contains(text(), 'OK')]"
        }
    }
});
