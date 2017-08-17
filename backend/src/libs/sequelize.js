const Sequelize = require('sequelize');
const log = require('./log')(module);

let connString = '';
if (process.env.NODE_ENV === 'production') {
    connString = 'postgres://xfiavfdkxwylbc:478b64833b95c54959ae3d80f21371b1b3cd52da5322e9dce541534f36d57b81@ec2-54-247-92-185.eu-west-1.compute.amazonaws.com:5432/ddfgjvilcicjfg';
} else {
    // development is default
    connString = 'postgres://vagrant:vagrant@postgres:5432/pkeeper';
}

const sequelize = new Sequelize(connString);

sequelize.authenticate().then(() => {
    log.info('Connection has been established successfully.');
})
    .catch(err => {
        log.error('Unable to connect to the database:', err.message);
    });

module.exports = sequelize;
