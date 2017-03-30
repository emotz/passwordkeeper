let base = require('./base.js');

let commands = {
    waitForEnglishLocale() {
        this.expect.element('@activeMenuItem').text.to.contain('Config').after();
        return this;
    },
    waitForRussianLocale() {
        this.expect.element('@activeMenuItem').text.to.contain('Настройки').after();
        return this;
    },
    selectLocale(locale) {
        let sel = `select.config-locale-input option[value="${locale}"]`;
        this.expect.element(sel).to.be.visible.after();
        return this.click(sel);
    }
};

let elements = {
    activeMenuItem: '.app-nav ul.navbar-nav li.active'
};

module.exports = new base({
    url: '/config',
    commands,
    elements
});
