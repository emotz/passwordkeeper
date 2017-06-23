const mongoose = require('./libs/mongoose');
const passentry = require('./models/passentry.js');

function createTestDB()
{
    mongoose.initConnect();
    let db = mongoose.connection.db;
    //db.dropCollection('passwords');
    //db.dropDatabase(function (err) {if (err) throw err; return;});
    let pass1 = new passentry.PassEntry ({
        "id": "aa259b63-af6c-0074-87f8-544b7efa4302",
        "title": "mytitle",
        "user": "myuser",
        "password": "mypassword"
    });
    pass1.save();
    let pass2 = new passentry.PassEntry ({
        "id": "ba259b63-af6c-0074-87d8-544b7efa4302",
        "title": "mytitle2",
        "user": "myuser2",
        "password": "mypassword123"
    });
    pass2.save();
    let pass3 = new passentry.PassEntry ({
        "id": "db259b63-hf6c-0074-87f8-544b7yfa4302",
        "title": "mytitle3",
        "user": "myuser3",
        "password": "mypassword321"
    });
    pass3.save();
    mongoose.disconnect();
}

module.exports.createTestDB = createTestDB;