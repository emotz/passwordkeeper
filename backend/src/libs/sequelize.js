const Sequelize = require('sequelize');
const log = require('./log')(module);

const sequelize = new Sequelize('postgres://vagrant:vagrant@127.0.0.1:5432/pkeeper');

sequelize.authenticate().then(() => {
    log.info('Connection has been established successfully.');
})
    .catch(err => {
        log.error('Unable to connect to the database:', err.message);
    });

module.exports = sequelize;
