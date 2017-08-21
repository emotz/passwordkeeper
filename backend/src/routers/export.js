const express = require('express');
const passport = require('../libs/passport');
const log = require('../libs/log.js')(module); // eslint-disable-line no-unused-vars
const path = require('path');

const exportfile = require('../services/exportfile');

const router = express.Router();

require('express-async-errors');

router.use(passport.authenticate('jwt'));

router.get('/csv', async function(req, res) {
    const user = req.user; // set by passport

    const filestr = await exportfile.ExportToCSV(user);
    res.statusCode = 200;
    res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(filestr));
    res.sendFile(filestr);
});

router.get('/xml', async function(req, res) {
    const user = req.user; // set by passport

    const filestr = await exportfile.ExportToXML(user);
    res.statusCode = 200;
    res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(filestr));
    res.sendFile(filestr);
});

module.exports = router;
