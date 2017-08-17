const express = require('express');
const passport = require('../libs/passport.js');
const log = require('../libs/log.js')(module); // eslint-disable-line no-unused-vars
const url = require('url');
const error = require('../libs/error.js');

const PassEntry = require('../models/passentry').PassEntry;

const router = express.Router();

require('express-async-errors');

router.use(passport.authenticate('jwt'));

router.route('/')
    .get(async function(req, res) {
        const user = req.user; // set by passport

        const passEntryList = await PassEntry.findAll({ where: { userID: user.id } });

        res.status(200);
        res.send(passEntryList);
    })
    .post(async function(req, res) {
        const user = req.user; // set by passport

        const newentry = await PassEntry.create({
            userID: user.id,
            title: req.body.title,
            user: req.body.user,
            password: req.body.password
        });

        res.status(201);
        res.location(url.resolve(req.originalUrl, newentry.id.toString()));
        res.send();
    })
    .delete(async function(req, res) {
        const user = req.user; // set by passport

        await PassEntry.destroy({ where: { userID: user.id } });

        res.status(204);
        res.send();
    });

router.route('/:id')
    .get(async function(req, res) {
        const user = req.user; // set by passport
        const id = req.params.id;

        let entry = await PassEntry.findOne({ where: { id: id, userID: user.id } });
        if (!entry) throw {
            code: error.ErrorCode.Db,
            type: error.Db.NotFound
        };

        res.status(200);
        res.send(entry);
    })
    .put(async function(req, res) {
        const user = req.user; // set by passport
        const id = req.params.id;

        const dto = {
            title: req.body.title,
            user: req.body.user,
            password: req.body.password
        };

        await PassEntry.update(dto, { where: { id: id, userID: user.id } });

        res.status(204);
        res.send();
    })
    .delete(async function(req, res) {
        const user = req.user; // set by passport
        const id = req.params.id;

        await PassEntry.destroy({ where: { id: id, userID: user.id } });

        res.status(204);
        res.send();
    });

module.exports = router;
