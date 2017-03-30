let commands = {
    load() {
        return this.navigate()
            .waitForElementVisible('#splash')
            .waitForLoad();
    },
    waitForLoad() {
        return this.waitForElementVisible('@footer');
    }
};

let elements = {
    footer: '#footer'
};

module.exports = function (options) {
    this.commands = options.commands !== undefined ? [commands, options.commands] : [commands];
    this.elements = options.elements !== undefined ? [elements, options.elements] : [elements];
    this.url = createUrl(options.url);
};

function createUrl(route) {
    return function () {
        return this.api.launchUrl + route;
    };
}
// TODO: it is not very good that this file is parsed as page object