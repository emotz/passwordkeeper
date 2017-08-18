const passport = require('passport');
const LocalStrategy = require('passport-local');
const error = require('./error');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const log = require('./log')(module);
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user').user;
// TODO: change to proper secret key
const jwtsecret = "mysecretkey";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    // TODO: use email as login
    usernameField: 'username',
    passwordField: 'password',
    session: false
},
    async function(username, password, done) {
        log.debug("verify local strategy");
        let userOne;
        try {
            userOne = await User.findOne({ where: { username: username } });
        } catch (orig_err) {
            const err = {
                code: error.ErrorCode.Other,
                context: {
                    username,
                    password
                },
                orig: orig_err
            };
            log.error(err);
            return done(err);
        }
        if (!userOne) {
            return done(make_error(error.Auth.NoUser));
        }
        if (!userOne.checkPassword(password)) {
            return done(make_error(error.Auth.WrongPassword));
        }
        log.debug("verification passed");
        return done(null, userOne);

        function make_error(error_type) {
            return {
                code: error.ErrorCode.Auth,
                type: error_type,
                context: {
                    username,
                    password
                }
            };
        }
    })
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: jwtsecret,
    session: false
};

passport.use(new JwtStrategy(jwtOptions, async function(payload, done) {
    log.debug("verify jwt strategy");
    let userOne;
    try {
        userOne = await User.findById(payload._id);
    } catch (orig_err) {
        const err = {
            code: error.ErrorCode.Other,
            context: {
                id: payload._id,
                payload
            },
            orig: orig_err
        };
        log.error(err);
        return done(err);
    }
    if (!userOne) {
        return done({
            code: error.ErrorCode.Auth,
            type: error.Auth.NoUser,
            context: {
                id: payload._id,
                payload
            }
        });
    }
    log.debug("verification passed");
    return done(null, userOne);
}));

module.exports = passport;
