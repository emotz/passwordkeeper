const Page = require('./page.js');

class HomePage extends Page {
    get passEntriesSelector() { return '.pk-pass-list tbody tr'; }
    /////////////////////////////////////////
    get modalButtonOk() { return browser.$('.btn-modal-ok'); }
    get searchInput() { return browser.$('.pk-pass-filter-input'); }
    get lastPassEntry() { return browser.$('.pk-pass-list tbody tr:last-child'); }
    get passEntries() { return browser.$$(this.passEntriesSelector); }
    /////////////////////////////////////////
    findPassEntryByTitle(title) {
        return this.passEntries.find(e => e.$('td').getText().includes(title));
    }
    /////////////////////////////////////////
    addPass(pass) {
        const adder = browser.$('.pk-pass-adder');
        adder.$('.pk-btn-pass-add').waitForEnabled();
        adder.$('.pk-title-input').setValue(pass.title);
        adder.$('.pk-user-input').setValue(pass.user);
        adder.$('.pk-pass-input').setValue(pass.password);
        adder.$('.pk-btn-pass-add').click();
    }
    searchPass(query) {
        this.searchInput.waitForVisible();
        // HACK: clearValue doesnt trigger event so we manually adding a ' ' and deleting it right away to trigger search
        this.searchInput.setValue(query === "" ? [" ", "\uE003"] : query);
    }
    editLastPass(pass) {
        this.lastPassEntry.$('.pk-btn-pass-edit').waitForEnabled();
        this.lastPassEntry.$('.pk-btn-pass-edit').click();
        const editor = browser.$('.pk-pass-editor');
        editor.$('.pk-title-input').waitForVisible();
        editor.pause(5000);
        editor.$('.pk-title-input').setValue(pass.title);
        editor.$('.pk-user-input').setValue(pass.user);
        editor.$('.pk-pass-input').setValue(pass.password);
        editor.$('.btn-modal-ok').click();
        editor.waitForVisible(undefined, true);
    }
    removePass(pass) {
        const entry = this.findPassEntryByTitle(pass.title);
        entry.$('.pk-btn-pass-remove').waitForEnabled();
        entry.$('.pk-btn-pass-remove').click();
    }
    removeLastPass() {
        this.lastPassEntry.$('.pk-btn-pass-remove').waitForEnabled();
        this.lastPassEntry.$('.pk-btn-pass-remove').click();
    }
    removeAllPasses() {
        this.passEntries.forEach(e => {
            e.$('.pk-btn-pass-remove').waitForEnabled();
            e.$('.pk-btn-pass-remove').click();
        });
    }
    refreshAllPasses() {
        browser.click('.pk-btn-refresh-all-pass');
        this.modalButtonOk.waitForEnabled();
        this.modalButtonOk.click();
        this.waitForSuccessNotification("Items fetched.");
    }
    waitForPass(pass, ...args) {
        browser.waitForVisible(`//div[contains(@class, "pk-pass-list")]//td[contains(text(), "${pass.title}")]`, ...args);
    }
    waitForNoPasses() {
        this.lastPassEntry.waitForExist(undefined, true);
    }
    /////////////////////////////////////////
    open() {
        super.open('/home');
    }
}
module.exports = new HomePage();
