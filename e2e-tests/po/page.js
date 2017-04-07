"use strict";

class Page {
    constructor() {
    }
    open(path) {
        browser.url(path || '/');
        browser.waitForVisible('#splash');
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
        browser.$('.pk-signin-user-input').waitForVisible();
    }
    login(user, password) {
        this.waitForLoginReady();
        browser.$('.pk-signin-user-input').setValue(user);
        browser.$('.pk-signin-pass-input').setValue(password);
        browser.$('.pk-btn-signin').click();
    }
    logout() {
        browser.$('.pk-btn-signout').waitForVisible();
        browser.$('.pk-btn-signout').click();
    }
    waitForFailedLogin(...args) {
        this.waitForErrorNotification("api_error.no user with matched password", ...args);
    }
}
module.exports = Page;
