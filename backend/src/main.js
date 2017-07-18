const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./libs/log.js')(module);
const passEntry = require('./models/passentry').PassEntry;
const user = require('./models/user').user;
const passport = require('./libs/passport.js');
const jwt = require('jsonwebtoken');

app.use(express.static('frontend/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


app.get('/home', function (req, res, next) {
	return res.redirect('/');
});

app.get('/api/entries', function (req, res, next) {
    return passport.authenticate('jwt', {session: 'false'}, async function (err, user, info){
        if (err){
            res.statusCode = 401;
            return res.send({ error: 'Server error: ' + err });
        }
        try {
            const passEntryList = await passEntry.findAll({ where: {userID: user.ID} });
            res.statusCode = 201;
            return res.send(passEntryList);
        } catch (err) {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    })(req, res, next);
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
        if (user === false) {
            res.body = "Login failed";
            return res.status(401).json({ status: 'error', code: 'unauthorized' });
        } else {
            const payload = {
                _id: user.ID,
                displayName: user.username,
                email: user.email
            };
            const token = jwt.sign(payload, "mysecretkey");
            return res.json({user: user.username, access_token: token});
        }
    })(req, res, next)
});

/*app.post('/api/token', async function (req, res, next) {
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
});*/

app.delete('/api/token',  function (req, res, next) {
    return res.location(`/home`).send();
});

app.post('/api/users', async function (req, res, next) {
    try {
        await user.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email});
        log.info("new user entry created");
        res.status = 201;
        res.location(`/api/login`);
        res.send();
    } catch(err) {
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

app.post('/api/entries', function (req, res, next) {
    return passport.authenticate('jwt', {session: 'false'}, async function (err, user, info){
        try {
            let newentryID = await passEntry.create({
            userID: user.ID,
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
    })(req, res, next)
});

app.put('/api/entries/:id', async function (req, res) {
    const updatedEntry = req.body;
    try{
        await passEntry.update({title: req.body.title, user: req.body.user, password: req.body.password}, {where: {ID: req.params[0]}});
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
        await passEntry.destroy({where: {ID: req.params[0]}});
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
    //console.log('Express server listening on port 1337');
    return;
});
