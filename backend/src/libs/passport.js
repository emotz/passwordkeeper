const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtsecret = "mysecretkey";
const User = require('../models/user').user;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
    },
    function (email, password, done) {
        User.findOne({email}, (err, user) => {
        if (err) {
            return done(err);
        }
      
        if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
          }
          return done(null, user);
        });
    })
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err)
        }
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
        })
    })
);