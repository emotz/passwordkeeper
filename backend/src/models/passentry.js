const mongoose = require('../libs/mongoose.js');
Schema = mongoose.Schema;

let passEntrySchema = new Schema({
    id: { type: String, required: true },
    title: String,
    user: { type: String, required: true },
    password: { type: String, required: true }
});

let PassEntry = mongoose.model('PassEntry', passEntrySchema);

function addPassEntry(passentry)
{
    let db = mongoose.initConnect();
    if (db < 0){
        //log.error('connection error:', err.message);
        return -1;
    }
    let newPassEntry = new PassEntry ({
        id: passentry.id,
        title: passentry.title,
        user: passentry.user,
        password: passentry.password
    });
    let res = newPassEntry.save(function (err) {
        if (err) return handleError(err);
        // saved!);
    });
    return res;
}

function getAllPassEntry()
{
    mongoose.initConnect();
    return PassEntry.find(function(err, passlist){if (err) if (err) return handleError(err); return passlist;});
}

module.exports.PassEntry = PassEntry;