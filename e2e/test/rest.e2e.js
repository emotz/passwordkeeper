const assert = require('assert');
const axios = require('axios');
let instance = axios;

const API = {
    EXPORT: 'http://test-server:1337/api/export',
    ENTRIES: 'http://test-server:1337/api/entries',
    TOKENS: 'http://test-server:1337/api/token',
    USERS: 'http://test-server:1337/api/users'
};

// const generateUniqueId = (function() {
//     let id = 0;
//     return function() {
//         return ++id;
//     };
// })();

describe('REST API', function() {
    beforeEach(function() {
        instance = axios;
    });
    describe('/api/entries', function() {
        it('should add entry', async function() {
            instance = await signin_as_new_user();
            let id = await addPassEntry("title", "username", "password");
            assert(id > 0);
        });
    });
    describe('/api/users', function() {
        it('should sign up', async function() {
            const username = generateUniqueString();
            const pass = generateUniqueString();
            const email = generateUniqueString();
            await signup(username, pass, email);
        });
    });
    describe('/api/export', function() {
        it('should fail with 500 for fresh anonymous', async function() {
            try {
                await instance.get(API.EXPORT);
            } catch (err) {
                assert(err.response.status === 500);
                return;
            }
            assert(false);
        });
        it('should success for fresh user', async function() {
            instance = await signin_as_new_user();

            let response = await instance.get(API.EXPORT);
            assert(response.status === 200);
        });
        it('should success for fresh user for double attempt in a row', async function() {
            instance = await signin_as_new_user();

            let response = await instance.get(API.EXPORT);
            assert(response.status === 200);

            response = await instance.get(API.EXPORT);
            assert(response.status === 200);
        });
        it('should success', async function() {
            instance = await signin_as_new_user();

            await add_any_pass_entry();

            let response = await instance.get(API.EXPORT);
            assert(response.status === 200);
        });
        it('should success for double attempt in a row', async function() {
            instance = await signin_as_new_user();

            await add_any_pass_entry();

            let response = await instance.get(API.EXPORT);
            assert(response.status === 200);

            response = await instance.get(API.EXPORT);
            assert(response.status === 200);
        });
    });
});
// helper functions
async function add_any_pass_entry() {
    const user = generateUniqueString();
    const title = generateUniqueString();
    const pass = generateUniqueString();
    return await addPassEntry(title, user, pass);
}
async function signin_as_new_user() {
    const username = generateUniqueString();
    const pass = generateUniqueString();
    const email = generateUniqueString();
    await signup(username, pass, email);
    let token = await signin(username, pass);
    let instance = axios.create({
        headers: { 'Authorization': 'Bearer ' + token }
    });
    return instance;
}
// action functions
async function signup(username, pass, email) {
    let response;
    try {
        response = await instance.post(API.USERS, {
            username: username,
            password: pass,
            email: email
        });
    } catch (err) {
        throw err;
    }
    if (response.status !== 200) throw new Error("couldnt signup");
}

async function signin(username, pass) {
    let response = await instance.post(API.TOKENS, {
        user: username,
        password: pass
    });
    if (response.status !== 200) throw new Error("couldnt signin");
    return response.data.access_token;
}

async function addPassEntry(title, user, password) {
    let response = await instance.post(API.ENTRIES, {
        title: title,
        user: user,
        password: password
    });
    if (response.status !== 201) throw new Error("couldnt add entry");
    return parse_location(response);
}
// utility functions
function generateUniqueId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function generateUniqueString() {
    return 'justsomesymbols' + generateUniqueId().toString();
}

function parse_location(response) {
    return parseInt(response.headers.location.split('/')[3]);
}
