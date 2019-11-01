const jwt = require('jsonwebtoken');

function generateToken(user) {
    // TODO: rename payload fields for consistency
    const payload = {
        _id: user.id,
        displayName: user.username,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "mysecretkey");
    return token;
}

module.exports = {
    generateToken
};
