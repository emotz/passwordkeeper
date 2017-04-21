//console.log("Nothing here yet!");
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const entries = require('./entries.json');
const log = require('./libs/log.js')(module);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

app.use(express.static('fe/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/entries', function (req, res, next) {
    res.json(entries).send();
});

app.get('/api/entries/:id', function (req, res, next) {
    res.json(enentries.find(entry => entry.id === res.params[0])).send();
});

app.post('/api/entries', function (req, res, next) {
    console.log(req.body);
    const newEntry = req.body;
    if (newEntry.id !== undefined) {
        res.status = 400;
        res.body = { reason: "request must not specify id" };
        return;
    }
    if (newEntry.title === undefined || newEntry.title === "") {
        res.status = 400;
        res.body = { reason: "request must specify non-empty title" };
        return;
    }
    if (newEntry.user === undefined || newEntry.user === "") {
        ctx.status = 400;
        ctx.body = { reason: "request must specify non-empty user" };
        return;
    }

    entries.push(newEntry);
    newEntry.id = guid();
    res.status = 201;
    res.location(`/api/entries/${newEntry.id}`);
    res.send();
});

app.put('/api/entries/:id', function (req, res) {
    const updatedEntry = req.body;
    updatedEntry.id = req.params[0];

    if (updatedEntry.title === undefined || updatedEntry.title === "") {
        res.status = 400;
        res.body = { reason: "request must specify non-empty title" };
        return;
    }
    if (updatedEntry.user === undefined || updatedEntry.user === "") {
        res.status = 400;
        res.body = { reason: "request must specify non-empty user" };
        return;
    }

    const existingEntryIndex = entries.findIndex(entry => entry.id === req.params[0]);
    if (existingEntryIndex < 0) {
        res.status = 404;
        res.body = { reason: "requested id wasn't found" };
        return;
    }
    entries.splice(existingEntryIndex, 1, updatedEntry);
    res.status = 200;
    res.send('OK');
});

app.delete('/api/entries/:id', function (req, res) {
    const existingEntryIndex = entries.findIndex(entry => entry.id === req.params[0]);
    if (~existingEntryIndex) entries.splice(existingEntryIndex, 1);
    res.status = 204;
    res.send('OK');
});

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});
