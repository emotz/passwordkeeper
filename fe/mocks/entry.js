'use strict';

const entries = require('./entries.json');
const _ = require('lodash');

/* responses for /entries/:id */
const mockResponses = [
    /* don't support POST here */
    { request: { method: 'POST' }, response: { status: 400 } },

    /* for GET requests, return a particular entry */
    {
        request: { method: 'GET' },
        response: function (ctx, id) {
            if (Math.random() > 0.5) {
                ctx.status = 408;
                return;
            }

            ctx.body = entries.find(entry => entry.id === Number(id));
        }
    },

    /* for PUT requests, update the record */
    {
        request: { method: 'PUT' },
        response: function (ctx, id) {
            if (Math.random() > 0.5) {
                ctx.status = 408;
                return;
            }

            const updatedEntry = ctx.request.body;
            updatedEntry.id = id;

            if (updatedEntry.title === undefined || updatedEntry.title === "") {
                ctx.status = 400;
                ctx.body = { reason: "request must specify non-empty title" };
                return;
            }
            if (updatedEntry.user === undefined || updatedEntry.user === "") {
                ctx.status = 400;
                ctx.body = { reason: "request must specify non-empty user" };
                return;
            }

            const existingEntryIndex = entries.findIndex(entry => entry.id === id);
            if (existingEntryIndex < 0) {
                ctx.status = 404;
                ctx.body = { reason: "requested id wasn't found" };
                return;
            }

            entries.splice(existingEntryIndex, 1, updatedEntry);
            ctx.status = 200;
        }
    },

    /* DELETE request: remove the record */
    {
        request: { method: 'DELETE' },
        response: function (ctx, id) {
            if (Math.random() > 0.5) {
                ctx.status = 408;
                return;
            }

            const existingEntryIndex = entries.findIndex(entry => entry.id === Number(id));
            entries.splice(existingEntryIndex, 1);
            ctx.status = 200;
        }
    }
];

module.exports = mockResponses;
