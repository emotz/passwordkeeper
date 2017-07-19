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
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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

User.sync();

module.exports.user = User;
