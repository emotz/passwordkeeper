const express = require('express');
const passport = require('../libs/passport.js');
const log = require('../libs/log.js')(module); // eslint-disable-line no-unused-vars
const auth = require('../auth.js');

const router = express.Router();

require('express-async-errors');

router.route('/')
    .post(
    passport.authenticate('local'),
    async function(req, res) {
      const user = req.user; // set by passport
      const token = auth.generateToken(user);
      res.json({ access_token: token });
    })
    .delete(async function(req, res) {
      res.status(204);
      res.send();
    });

module.exports = router;
