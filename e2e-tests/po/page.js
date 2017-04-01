"use strict";

class Page {
    constructor() {
    }
    open(path) {
        browser.url(path);
        browser.waitForVisible('#splash');
        browser.waitForVisible('#footer');
        browser.waitForVisible('#splash', undefined, true);
    }
    waitForSuccessNotification(content) {
        browser.$('.toast-success').waitForText(content);
    }
}
module.exports = Page;
