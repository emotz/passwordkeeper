const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./libs/log.js')(module);
const passEntry = require('./models/passentry').PassEntry;
const user = require('./models/user').user;
const passport = require('./libs/passport.js');
const jwt = require('jsonwebtoken');

const DIST_PATH = path.resolve('./frontend/dist');

app.use(express.static(DIST_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


            res.statusCode = 401;
            return res.send({ error: 'Server error: ' + err });
        }
        try {
            const passEntryList = await passEntry.findAll({ where: { userID: user.id } });
            res.statusCode = 201;
            return res.send(passEntryList);
        } catch (err) {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    })(req, res, next);
});

        try {
            const passEntryOne = await passEntry.findOne({ where: { id: res.params[0] } });
            return res.send(passEntryOne);
        } catch (err) {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    })(req, res, next);
});

app.post('/api/token', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (user === false) {
            res.body = "Login failed";
            return res.status(401).json({ status: 'error', code: 'unauthorized' });
        } else {
            const payload = {
                _id: user.id,
                displayName: user.username,
                email: user.email
            };
            const token = jwt.sign(payload, "mysecretkey");
            return res.json({ user: user.username, access_token: token });
        }
    })(req, res, next);
});

app.delete('/api/token', function(req, res, next) {
    return res.location(`/home`).send();
});

app.post('/api/users', async function(req, res, next) {
    try {
        const dto = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };
        log.debug("received post api/users");
        log.debug(dto);
        await user.create(dto);
        log.info("new user entry created");
        res.status = 201;
        res.location(`/api/login`);
        res.send();
    } catch (err) {
        if (err.username == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
        } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
});

app.post('/api/entries', function(req, res, next) {
    return passport.authenticate('jwt', { session: 'false' }, async function(err, user, info) {
        try {
            let newentryID = await passEntry.create({
                userID: user.id,
                title: req.body.title,
                user: req.body.user,
                password: req.body.password
            }).get('id');
            res.statusCode = 201;
            res.location(`/api/entries/${newentryID}`);
            res.send();
        } catch (err) {
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    })(req, res, next);
});

app.put('/api/entries/:id', async function(req, res, next) {
    return passport.authenticate('jwt', { session: 'false' }, async function(err, user, info) {
        const updatedEntry = req.body;
        try {
            await passEntry.update({ title: req.body.title, user: req.body.user, password: req.body.password }, { where: { id: req.params[0] } });
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
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    })(req, res, next);
});

app.delete('/api/entries/:id', async function(req, res, next) {
    return passport.authenticate('jwt', { session: 'false' }, async function(err, user, info) {
        try {
            await passEntry.destroy({ where: { id: req.params.id } });
            res.status = 204;
            res.send('OK');
        }
        catch (err) {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    })(req, res, next);
});

app.get('*', function(req, res) {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.use(function(req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({ error: err.message });
    return;
});

app.listen(1337, function() {
    //console.log('Express server listening on port 1337');
    return;
});
