const Page = require('./page.js');

class AboutPage extends Page {
    get body() { return browser.element('body'); }

    open() {
        super.open('/about');
    }
}
module.exports = new AboutPage();
