'use strict';

const users = require('./users.json');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

const sessions = [];

/* responses for /sessions */
const mockResponses = [
    /* Respond with 400 Bad Request for PUT and DELETE - inappropriate on a collection */
    {
        request: { method: 'DELETE' },
        response: function (ctx) {
            let token = ctx.request.get('Authorization'); // TODO: check if it actually works and correctly gets the info
            sessions.splice(sessions.indexOf(token), 1);
            ctx.status = 204;
        }
    },
    {
        /* for POST requests, create a new entry and return the path to the new resource */
        request: { method: 'POST' },
        response: function (ctx) {
            const { user, password } = ctx.request.body;
            if (users.find(u => u.user === user && u.password === password) === undefined) {
                // user or password is wrong
                ctx.status = 403;
                ctx.body = { reason: "no user with matched password" };
                return;
            }

            let token = guid();
            sessions.push(token);

            ctx.status = 201;
            ctx.response.body = { access_token: token };
        }
    }
];

module.exports = mockResponses;
