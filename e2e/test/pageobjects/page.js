class Page {
    constructor() {
    }
    open(path) {
        browser.url(path || '/');
        browser.waitForVisible('#footer');
        browser.waitForVisible('#splash', undefined, true);
    }
    waitForSuccessNotification(content, ...args) {
        browser.$(`.toast-success=${content}`).waitForVisible(...args);
    }
    waitForErrorNotification(content, ...args) {
        browser.$(`.toast-error=${content}`).waitForVisible(...args);
    }
    waitForLoginReady() {
        browser.$('.pk-btn-signin').waitForVisible();
    }
    login(user, password) {
        this.waitForLoginReady();
        browser.$('.pk-signin-user-input').setValue(user);
        browser.$('.pk-signin-pass-input').setValue(password);
        browser.$('.pk-btn-signin').click();
    }
    waitForLogoutReady() {
        browser.$('.pk-btn-signout').waitForVisible();
    }
    logout() {
        browser.$('.pk-btn-signout').waitForVisible();
        browser.$('.pk-btn-signout').click();
    }
    waitForFailedLogin(...args) {
        this.waitForErrorNotification("No user with matched password.", ...args);
    }
}
module.exports = Page;
