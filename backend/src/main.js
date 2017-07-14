const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const entries = require('./entries.json');
const log = require('./libs/log.js')(module);
const passEntry = require('./models/passentry').PassEntry;
const user = require('./models/user').user;
const passport = require('./libs/passport.js');

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
