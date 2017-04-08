const sessions = [];

function handleAuthError(ctx, err) {
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
function checkAuth(authHeader) {
    if (authHeader === undefined || authHeader === null || authHeader === "") throw 'missing authorization header';
    let m = authHeader.match(/Bearer (.*)/);
    if (m === null) throw 'access header is malformed';
    let token = m[1];
    if (!~sessions.indexOf(token)) throw 'access token is not valid';
    return token;
}

function deleteSession(token) {
    let index = sessions.indexOf(token);
    if (~index) {
        sessions.splice(index, 1);
    }
}

function createSession() {
    let token = guid();
    sessions.push(token);
    return token;
}

module.exports = {
    handleAuthError,
    checkAuth,
    deleteSession,
    createSession
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