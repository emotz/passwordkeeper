const express = require('express');
const log = require('../libs/log.js')(module); // eslint-disable-line no-unused-vars
const User = require('../models/user').user;

const router = express.Router();

require('express-async-errors');

router.route('/')
    .post(async function(req, res) {
      const dto = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      };

      await User.create(dto);

      res.statusCode = 201;
      res.send();
    });

module.exports = router;
