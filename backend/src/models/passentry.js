const sequelize = require('../libs/sequelize.js');
const Sequelize = require('sequelize');
const PassEntry = sequelize.define('passentry', {
    ID : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    user: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

PassEntry.sync();

module.exports.PassEntry = PassEntry;