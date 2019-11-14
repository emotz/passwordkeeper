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
  waitForSignupReady() {
    browser.$('.pk-btn-signup').waitForVisible();
    this.waitForToastToHide();
  }
  waitForLoginReady() {
    browser.$('.pk-btn-signin').waitForVisible();
    this.waitForToastToHide();
  }
  signup(user, password, email) {
    this.waitForSignupReady();
    browser.$('.pk-btn-signup').click();
    browser.$('.pk-signup-username-input').setValue(user);
    browser.$('.pk-signup-email-input').setValue(email);
    browser.$('.pk-signup-pass-input').setValue(password);
    browser.$('.btn-modal-ok').click();
  }
  login(login, password) {
    this.waitForLoginReady();
    browser.$('.pk-btn-signin').click();
    browser.$('.pk-signin-login-input').setValue(login);
    browser.$('.pk-signin-pass-input').setValue(password);
    browser.$('.btn-modal-ok').click();
  }
  waitForLogoutReady() {
    browser.$('.pk-btn-signout').waitForVisible();
    this.waitForToastToHide();
  }
  logout() {
    browser.$('.pk-btn-signout').waitForVisible();
    browser.$('.pk-btn-signout').click();
  }
  waitForFailedLogin(...args) {
        // this.waitForErrorNotification("No user with matched password.", ...args);
        // TODO: make proper check for failed login
    browser.$('.pk-signin').waitForVisible();
  }
  waitForSuccessLogout() {
    this.waitForLoginReady();
  }
  waitForSuccessLogin() {
    browser.$('.pk-signin').waitForVisible(undefined, true);
  }
  waitForFailedSignup() {
    browser.$('.pk-signup').waitForVisible();
  }
  waitForSuccessSignup() {
    browser.$('.pk-signup').waitForVisible(undefined, true);
  }
  waitForToastToHide() {
    browser.$('.toast').waitForVisible(10000, true);
  }
  hideModal() {
    browser.$('.btn-modal-cancel').click();
  }
}
module.exports = Page;
