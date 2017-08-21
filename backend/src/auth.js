const jwt = require('jsonwebtoken');

function generateToken(user) {
    // TODO: rename payload fields for consistency
    const payload = {
        _id: user.id,
        displayName: user.username,
        email: user.email
    };
    // TODO secret key
    const token = jwt.sign(payload, "mysecretkey");
    return token;
}

module.exports = {
    generateToken
};
