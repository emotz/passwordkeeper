const entries = require('./entries.json');

/* responses for /entries/:id */
const mockResponses = [
    /* for GET requests, return a particular entry */
    {
        request: { method: 'GET' },
        response: function(ctx, id) {
            ctx.body = entries.find(entry => entry.id === id);
        }
    },

    /* for PUT requests, update the record */
    {
        request: { method: 'PUT' },
        response: function(ctx, id) {
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
        response: function(ctx, id) {
            const existingEntryIndex = entries.findIndex(entry => entry.id === id);
            if (~existingEntryIndex) entries.splice(existingEntryIndex, 1);
            ctx.status = 204;
        }
    }
];

module.exports = mockResponses;
