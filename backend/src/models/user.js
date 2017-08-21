const sequelize = require('../libs/sequelize.js');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        // HACK: For some reason it doesnt work therefore custom validator
        // notEmpty: true
        validate: {
            isNotEmpty: function(val) {
                // TODO: make proper error
                if (val.length <= 0) throw new Error("Email must not be empty");
            },
            mustContainAt: function(val) {
                // TODO: make proper error
                if (!~val.indexOf('@')) throw new Error("Email must contain \"@\"");
            }
        }
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        // HACK: For some reason it doesnt work therefore custom validator
        // notEmpty: true
        validate: {
            isNotEmpty: function(val) {
                // TODO: make proper error
                if (val.length <= 0) throw new Error("Username must not be empty");
            },
            mustNotContainAt: function(val) {
                // TODO: make proper error
                if (~val.indexOf('@')) throw new Error("Username must not contain \"@\"");
            }
        }
    },
    passwordHash: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.VIRTUAL,
        set: function(val) {
            this.setDataValue('password', val);
            this.setDataValue('salt', crypto.randomBytes(128).toString('base64'));
            this.setDataValue('passwordHash', crypto.pbkdf2Sync(val, this.salt, 1, 128, 'sha1').toString('hex'));
        },
        validate: {
            isLongEnough: function(val) {
                if (val.length < 7) {
                    // TODO: make proper error
                    throw new Error("Please choose a longer password");
                }
            }
        }
    }
});

User.prototype.checkPassword = function(password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString('hex') == this.passwordHash;
};
User.findByLogin = async function(login) {
    let userOne;
    if (~login.indexOf('@')) {
        userOne = await User.findOne({ where: { email: login } });
    } else {
        userOne = await User.findOne({ where: { username: login } });
    }
    return userOne;
};

User.sync();

module.exports.user = User;
