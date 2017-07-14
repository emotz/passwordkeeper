const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const entries = require('./entries.json');
const log = require('./libs/log.js')(module);
const passEntry = require('./models/passentry').PassEntry;
const user = require('./models/user').user;
const passport = require('./libs/passport.js');
const jwt = require('jsonwebtoken');

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

app.get('/api/entries', async function (req, res, next) {
    try {
        const passEntryList = await passEntry.findAll();
        return res.send(passEntryList);
	} catch (err) {
		res.statusCode = 500;
		log.error('Internal error(%d): %s',res.statusCode,err.message);
		return res.send({ error: 'Server error' });		
	}
});

app.get('/api/entries/:id', async function (req, res, next) {
    try {
        const passEntryOne = await passEntry.findOne({ where: {ID: res.params[0]} });
        return res.send(passEntryOne);
	} catch (err) {
		res.statusCode = 500;
		log.error('Internal error(%d): %s',res.statusCode,err.message);
		return res.send({ error: 'Server error' });		
	}
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
     try {
		let newentryID = passEntry.create({
        title: req.body.title,
        user: req.body.user,
        password: req.body.password}).get('ID');
        res.statusCode = 201;
        res.location(`/api/entries/${newentryID}`);
        res.send();
	} catch (err) {
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

app.put('/api/entries/:id', async function (req, res) {
    const updatedEntry = req.body;
    try{
        passEntry.update({title: req.body.title, user: req.body.user, password: req.body.password}, {where: {ID: req.params[0]}});
        res.statusCode = 200;
        res.send('OK');
    }
    catch (err) {
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
		res.statusCode = 500;
		log.error('Internal error(%d): %s',res.statusCode,err.message);
		return res.send({ error: 'Server error' });		
    }
});

app.delete('/api/entries/:id', async function (req, res) {
    try{
        passEntry.destroy({where: {id: req.params[0]}});
        res.status = 204;
        res.send('OK');
    }
    catch (err) {
		res.statusCode = 500;
		log.error('Internal error(%d): %s',res.statusCode,err.message);
		return res.send({ error: 'Server error' });		
    }
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
