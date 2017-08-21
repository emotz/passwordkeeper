const assert = require('chai').assert;
const Axios = require('axios');

const config = require('../../wdio.conf.js').config;

const utls = require('./utls');
const helper = require('./helper');

const API_URL = config.baseUrl;

['csv', 'xml'].forEach(function(t) {
    describe(`REST /api/export`, function() {

        describe('anonymous', function() {
            const axios = Axios;

            describe(`get ${t}`, function() {
                it('should fail with 401', async function() {
                    try {
                        await axios.get(API_URL + `/api/export/${t}`);
                    } catch (err) {
                        assert(err.response.status === 401);
                        return;
                    }
                    assert(false);
                });
            });
        });
        describe('authenticated', function() {
            const user = utls.generateUserDto();
            let axios = Axios;

            beforeAll(async function() {
                let token = await helper.signinWithSignup(user);
                axios = axios.create({
                    baseURL: API_URL,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            });

            afterEach(async function() {
                await axios.delete('/api/entries');
            });

            describe(`get ${t}`, function() {
                it('should success for fresh user', async function() {
                    let response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);
                });
                it('should success for fresh user for double attempt in a row', async function() {
                    let response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);

                    response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);
                });
                it('should success', async function() {
                    await helper.addAnyPassEntry(axios);

                    let response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);
                });
                it('should success for double attempt in a row', async function() {
                    await helper.addAnyPassEntry(axios);

                    let response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);

                    response = await axios.get(API_URL + `/api/export/${t}`);
                    assert(response.status === 200);
                });
            });
        });
    });
});
