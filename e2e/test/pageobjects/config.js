const Page = require('./page.js');

class ConfigPage extends Page {
    get activeMenuItem() { return browser.element('.pk-app-nav ul.navbar-nav li.active'); }

    waitForEnglishLocale() {
        this.activeMenuItem.$(`a=Config`).waitForVisible();
    }

    waitForRussianLocale() {
        this.activeMenuItem.$(`a=Настройки`).waitForVisible();
    }

    selectLocale(locale) {
        const opt = browser.element(`select.pk-config-locale-input option[value="${locale}"]`);
        opt.waitForVisible();
        opt.click();
    }

    open() {
        super.open('/config');
    }
}
module.exports = new ConfigPage();
