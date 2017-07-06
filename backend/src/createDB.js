/*const mongoose = require('./libs/mongoose');
const passentry = require('./models/passentry.js');

function createTestDB()
{
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
}

module.exports.createTestDB = createTestDB;*/
db = connect("localhost:27017/passwordkeeper");
db.dropDatabase();
db.passentries.insertOne({
    "id": "aa259b63-af6c-0074-87f8-544b7efa4302",
    "title": "mytitle",
    "user": "myuser",
    "password": "mypassword"
});
db.passentries.insertOne({
    "id": "aa259b63-af6c-0074-87f8-544b7efa4304",
    "title": "mytitle2",
    "user": "myuser2",
    "password": "mypassword"
});
db.passentries.insertOne({
    "id": "db259b63-hf6c-0074-87f8-544b7yfa4302",
    "title": "mytitle3",
    "user": "myuser3",
    "password": "mypassword321"
});
printjson(db.passentries.find().toArray());
db.user.insertOne({
    "name":"myuser",
    "password":"mypassword",
 });
 db.user.insertOne({
    "name":"myuser12",
    "password":"mypassword12",
 });
 printjson(db.user.find().toArray());
db.logout();