function generateUniqueId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function generateUniqueString() {
    return 'justsomesymbols' + generateUniqueId().toString();
}

function generateUserDto() {
    return {
        username: generateUniqueString(),
        password: generateUniqueString(),
        email: generateUniqueString() + '@whatever.com',
    };
}
function parseEntryIdFromLocationHeader(location) {
    return parseInt(location.split('/')[3]);
}

module.exports = {
    generateUniqueId,
    generateUniqueString,
    generateUserDto,
    parseEntryIdFromLocationHeader
};
