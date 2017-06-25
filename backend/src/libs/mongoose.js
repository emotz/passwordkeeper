const mongoose    = require('mongoose');
const log         = require('./log')(module);

mongoose.connect('mongodb://localhost/test1');
const db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

let Schema = mongoose.Schema;

// Schemas
let Password = new Schema({
    id: { type: String, required: true },
    title: String,
    user: { type: String, required: true },
    password: { type: String, required: true }
});

let User = new Schema({
    id: { type: String, required: true },
    password: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true }
});

var PasswordModel = mongoose.model('Password', Password);

module.exports.PasswordModel = PasswordModel;