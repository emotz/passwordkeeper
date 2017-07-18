const passport = require('passport');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user').user;
const jwtsecret = "mysecretkey";

passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    session: false
    },
    async function (username, password, done) {
        try {
            const userOne = await User.findOne({where: {username: username}});
            if (!userOne || !userOne.checkPassword(password)) {
                return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
            }
            return done(null, userOne);
        } catch (err) {
            return done(err);
        }
    })
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: jwtsecret
};

passport.use(new JwtStrategy (jwtOptions, async function (payload, done) {
    try {
        const userOne = await User.findById(payload._id);
        if (userOne) {
            return done(null, userOne);
        }
        return done(null, false);
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;