const jwt = require('jsonwebtoken');
const config = require('./config');

function generateToken(user) {
    // TODO: rename payload fields for consistency
    const payload = {
        _id: user.id,
        displayName: user.username,
        email: user.email
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
}

module.exports = {
    generateToken
};
