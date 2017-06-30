const mongoose = require('../libs/mongoose.js');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    created: { type: Date, default: Date.now },
    token: { type: Date, default: Date.now }
});

userSchema.virtual('password')
.set(function (password) {
    this._plainPassword = password;
    if (password) {
        this.salt = crypto.randomBytes(128).toString('base64');
        this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    } else {
        this.salt = undefined;
        this.passwordHash = undefined;
  }
})
.get(function () {
    return this._plainPassword;
});

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

module.exports.user = User;