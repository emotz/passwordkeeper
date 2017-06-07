'use strict';

const users = require('./users.json');
const auth = require('./helpers/auth.js');

/* responses for /sessions */
const mockResponses = [
    {
        /**
         * @param {*} ctx Koa Context
         */
        response: function(ctx) {
            let authHeader = ctx.request.get('Authorization');
            let token;
            try {
                token = auth.check_auth(authHeader);
            } catch (err) {
                auth.handle_auth_error(ctx, err);
                return;
            }
            auth.delete_token(token);
            ctx.status = 204;
        }
    },
    {
        request: { method: 'POST' },
        response: function(ctx) {
            const { user, password } = ctx.request.body;
            if (users.find(u => u.user === user && u.password === password) === undefined) {
                ctx.status = 403;
                ctx.body = { reason: "no user with matched password" };
                return;
            }
            let token = auth.create_token();
            ctx.status = 201;
            ctx.response.body = { access_token: token };
        }
    }
];

module.exports = mockResponses;
