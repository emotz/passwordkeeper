const config = require('./config');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./libs/log.js')(module);
const passport = require('./libs/passport');
const error = require('./libs/error');

const routerEntries = require('./routers/entries');
const routerToken = require('./routers/token');
const routerUsers = require('./routers/users');

const DIST_PATH = path.resolve('./frontend/dist');

require('express-async-errors');

app.use(express.static(DIST_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

if (config.isDev) {
    app.use(function(req, res, next) {
        log.debug("got request", req.originalUrl);
        next();
    });
}

app.use('/api/entries', routerEntries);
app.use('/api/token', routerToken);
app.use('/api/users', routerUsers);

app.use('/api/*', function(req, res) {
    throw {
        code: error.ErrorCode.Other,
        type: error.Other.NotFound
    };
});

app.get('*', function(req, res) {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.use(errorPreparer);
app.use(errorSender);

app.listen(config.port, function() {
    log.info(`Express server listening on port ${config.port}`);
    return;
});

function errorPreparer(err, req, res, next) {
    if (err.name === 'SequelizeValidationError') {
        throw {
            code: error.ErrorCode.Validation,
            errors: err.errors
        };
    }
    if (err.name === 'SequelizeDatabaseError') {
        if (err.original.code === '22P02') {
            // invalid input syntax for integer
            throw {
                code: error.ErrorCode.Other,
                type: error.Other.BadRequest
            };
        }
        throw {
            code: error.ErrorCode.Db,
            orig: err
        };
    }
    if (err.code) throw err; // means it is "our" error
    throw {
        code: error.ErrorCode.Other,
        orig: err
    };
}

function errorSender(err, req, res, next) {
    // when you add something here, you should add corresponding handler
    //  to frontend/src/plugins/error.js
    applyContext(err);
    // TODO: winston skips a lot of info for large errors
    if (config.isDev) log.info(err); // if dev env, log all errors

    switch (err.code) {
        case error.ErrorCode.Other:
            switch (err.type) {
                case error.Other.BadRequest:
                    res.status(400);
                    res.send();
                    return;
                case error.Other.NotFound:
                    res.status(404);
                    res.send();
                    return;
            }
            break;
        case error.ErrorCode.Db:
            switch (err.type) {
                case error.Db.NotFound:
                    res.status(404);
                    res.send();
                    return;
            }
            break;
        case error.ErrorCode.Auth:
            switch (err.type) {
                case error.Auth.NoUser:
                case error.Auth.WrongPassword:
                    res.status(401);
                    res.send({
                        code: error.ErrorCode.Auth,
                        // TODO: fix magic string
                        type: "WrongPasswordOrUsername"
                    });
                    return;
            }
            break;
        case error.ErrorCode.Validation:
            res.status(400);
            res.send(err);
            return;
    }
    if (!config.isDev) log.error(err); // if prod env, log only unhandled errors

    res.status(500);
    res.send({
        code: error.ErrorCode.Other,
        // possible security hole - unknown error can provide sensitive info
        message: error.orig ? error.orig.toString() : undefined
    });
    return;

    function applyContext(err) {
        if (err.context === undefined) {
            err.context = {
                params: req.params,
                url: req.originalUrl,
                body: req.body
            };
        }
    }
}
