const sequelize = require('../libs/sequelize.js');
const crypto = require('crypto');
const User = sequelize.define('user', {
    ID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: sequelize.TEXT,
        allowNull: false
    },
    salt: {
        type: sequelize.STRING,
        allowNull: false
    },
    created: {
        type: sequelize.STRING
    },
    token: {
        type: sequelize.STRING
    },
    password: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
            this.setDataValue('password', val);
            this.setDataValue('salt', crypto.randomBytes(128).toString('base64'));
            this.setDataValue('password_hash', crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1'));
        },
        validate: {
            isLongEnough: function (val) {
            if (val.length < 7) {
                throw new Error("Please choose a longer password")
            }
        }
        }
  }
});


/*const mongoose = require('../libs/mongoose.js');
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

userSchema.methods.checkPassword =   (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

module.exports.user = User;*/