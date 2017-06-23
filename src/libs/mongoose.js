const mongoose    = require('mongoose');
const log         = require('./log')(module);
const url =  'mongodb://localhost:27017/testdb';

function initConnect()
{
    mongoose.connect(url);
    const db = mongoose.connection;

    db.on('error', function (err) {
        log.error('connection error:', err.message);
    });

    db.once('open', function callback () {
        log.info("Connected to DB!");
    });
}

//initConnect();

module.exports = mongoose;
module.exports.initConnect = initConnect;