const entries = require('./entries.json');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/* responses for /entries */
const mockResponses = [
    {
        /* for GET requests return a subset of data */
        request: { method: 'GET' },
        response: function(ctx) {
            ctx.body = entries;
        }
    },
    {
        /* for POST requests, create a new entry and return the path to the new resource */
        request: { method: 'POST' },
        response: function(ctx) {
            const newEntry = ctx.request.body;
            if (newEntry.id !== undefined) {
                ctx.status = 400;
                ctx.body = { reason: "request must not specify id" };
                return;
            }
            if (newEntry.title === undefined || newEntry.title === "") {
                ctx.status = 400;
                ctx.body = { reason: "request must specify non-empty title" };
                return;
            }
            if (newEntry.user === undefined || newEntry.user === "") {
                ctx.status = 400;
                ctx.body = { reason: "request must specify non-empty user" };
                return;
            }

            entries.push(newEntry);
            newEntry.id = guid();
            ctx.status = 201;
            ctx.response.set('Location', `/entries/${newEntry.id}`);
        }
    }
];

module.exports = mockResponses;
