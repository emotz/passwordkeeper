const tokens = require('./tokens.json');

function handle_auth_error(ctx, err) {
    if (err === "missing authorization header" || err === "access header is malformed") {
        ctx.status = 400;
        ctx.body = { reason: err };
        return;
    }
    ctx.status = 403;
    ctx.body = { reason: err };
    return;
}

/**
 * 
 * @param {string} authHeader 
 * @returns {string} Token
 * @throws {string} Error message
 */
function check_auth(authHeader) {
    if (authHeader === undefined || authHeader === null || authHeader === "") throw 'missing authorization header';
    let m = authHeader.match(/Bearer (.*)/);
    if (m === null) throw 'access header is malformed';
    let token = m[1];
    if (!~tokens.indexOf(token)) throw 'access token is not valid';
    return token;
}

function delete_token(token) {
    let index = tokens.indexOf(token);
    if (~index) {
        tokens.splice(index, 1);
    }
}

function create_token() {
    let token = guid();
    tokens.push(token);
    return token;
}

module.exports = {
    handle_auth_error,
    check_auth,
    delete_token,
    create_token
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}