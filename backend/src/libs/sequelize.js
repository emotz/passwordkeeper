const Sequelize = require('sequelize');
const log = require('./log')(module);
const config = require('../config');

const connString = `postgres://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`;
const sequelize = new Sequelize(connString);

// BUG: it is possible to try to use sequelize before connection is established
sequelize.authenticate().then(
  () => {
    log.info('Connection has been established successfully.');
  },
  err => {
    log.error('Unable to connect to the database:', err.message);
  });

module.exports = sequelize;
