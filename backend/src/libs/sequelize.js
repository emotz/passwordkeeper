let Sequelize = require('sequelize');
const log         = require('./log')(module);
Sequelize = new Sequelize('pkeeper', 'vagrant', '', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

Sequelize.authenticate().then(() => {
    log.info('Connection has been established successfully.');
  })
  .catch(err => {
    log.error('Unable to connect to the database:', err.message);
  });

module.exports = Sequelize;