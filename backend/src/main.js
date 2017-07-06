const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const entries = require('./entries.json');
const log = require('./libs/log.js')(module);
const mongoose = require('./libs/mongoose');
const passEntry = require('./models/passentry').PassEntry;
const user = require('./models/user').user;
const passport = require('./libs/passport.js');
const jwt = require('jsonwebtoken');

mongoose.initConnect();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

app.use(express.static('frontend/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/home', function (req, res, next) {
        return res.redirect('/');
});

app.get('/api/entries', function (req, res, next) {
    // BFB - Big Fucking Bug with MongoDB default _id field and local id fromv Vue
    return passEntry.find({}, 'id title user password -_id', function(err, passEntryList){
        if (err){
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        return res.send(passEntryList);
    });
});

app.get('/api/entries/:id', function (req, res, next) {
    passEntry.find({'id': res.params[0]}, function(err, passentry){
        if (err){
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        return res.send(passentry)
    });
});

app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (err, user){
        console.log(user);
        if (user === false) {
            res.body = "Login failed";
            return res.status(401).json({ status: 'error', code: 'unauthorized' });
        } else {
            const payload = {
                id: user._id,
                displayName: user.username,
                email: user.email
            };
            const token = jwt.sign(payload, "mysecretkey");
            console.log('token:' + token);
            return res.json({user: user.username, access_token: token});
        }
    })(req, res, next)
});

app.post('/api/token', function (req, res, next) {
    if (req.body.user && req.body.password) {
        var username = req.body.user;
        var password = req.body.password;
        var usertest = user.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (usertest) {
            var payload = {
                id: usertest._id,
                displayName: usertest.username,
                email: usertest.email
            };
            var token = jwt.sign(payload, "mysecretkey");
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

app.post('/api/users', function (req, res, next) {
    console.log(req.body);
    user.create(req.body, function (err) {
        if (!err) {
            log.info("new user entry created");
            res.status = 201;
            res.location(`/api/login`);
            res.send();
        } else {
            console.log(err);
            if(err.username == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.post('/api/entries', function (req, res, next) {
    let entryid = guid();
    passEntry.create({
        id: entryid,
        title: req.body.title,
        user: req.body.user,
        password: req.body.password
    }, function (err) {
        if (!err) {
            log.info("new password entry created");
            res.status = 201;
            res.location(`/api/entries/${entryid}`);
            res.send();
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
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
    passEntry.findOneAndUpdate({'id': req.params[0]}, {$set:{title: req.body.title, user: req.body.user, password: req.body.password}}, function(err, passentry){
        if (err){
            res.status = 404;
            res.body = { reason: "requested id wasn't found" };
            return;
        }
        res.status = 200;
        res.send('OK');
    });
});

app.delete('/api/entries/:id', function (req, res) {
    passEntry.deleteOne(req.params[0], function(err){
        if (err){
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        res.status = 204;
        res.send('OK');
    });
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
