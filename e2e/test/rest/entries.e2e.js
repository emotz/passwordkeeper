const assert = require('chai').assert;
const Axios = require('axios');

const config = require('../../wdio.conf.js').config;
const url = require('url');

const utls = require('./utls');
const helper = require('./helper');

const API_PATH = '/api/entries';
const API_URL = url.resolve(config.baseUrl, API_PATH);

describe(`REST ${API_PATH} `, function() {
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
        await axios.delete();
    });

    describe('get ', function() {
        it('should get no passentries for fresh user', async function() {
            let response = await axios.get();
            assert(response.data.length === 0);
        });
    });

    describe('post ', function() {
        it('should post passentry', async function() {
            let response = await axios.post('/', {
                title: "sometitle",
                user: "someuser",
                password: "somepassword"
            });
            assert(response.status === 201);
            assert.match(response.headers.location, new RegExp(`${API_PATH}/\\d+`));
        });

        it('should post passentry and get it back', async function() {
            const dto = {
                title: "sometitle",
                user: "someuser",
                password: "somepassword"
            };
            await axios.post('/', dto);

            let response = await axios.get();
            assert(response.data.length === 1);
            const res = response.data[0];
            assert.deepEqual({
                title: res.title,
                user: res.user,
                password: res.password
            }, dto);
        });

        it('should not post not-valid passentry', async function() {
            try {
                await axios.post('/', {
                    title: "sometitle",
                    password: "somepassword"
                });
            } catch (err) {
                assert(err.response.status === 400);
                assert(err.response.data.errors[0].path === 'user');
                return;
            }
            assert(false);
        });
    });

    describe('/:id ', function() {
        const dto = {
            title: "sometitle",
            user: "someuser",
            password: "somepassword"
        };

        beforeEach(async function() {
            const response = await axios.post('/', dto);
            const id = utls.parseEntryIdFromLocationHeader(response.headers.location);
            dto.id = id;
        });

        describe('get ', function() {
            it('should get', async function() {
                let response = await axios.get(`/${dto.id}`);

                assert(response.status === 200);
                let res = response.data;
                let resDto = {
                    id: res.id,
                    title: res.title,
                    user: res.user,
                    password: res.password
                };
                assert.deepEqual(resDto, dto);
            });

            it('should get 400 for nonvalid id', async function() {
                const nonValidId = 'aqwer124213afsdf';
                try {
                    await axios.get(`/${nonValidId}`);
                } catch (err) {
                    assert.equal(err.response.status, 400);
                    return;
                }
                assert(false);
            });

            it('should get 404 for nonexistent id', async function() {
                const nonExistentId = 1231231231;
                try {
                    await axios.get(`/${nonExistentId}`);
                } catch (err) {
                    assert.equal(err.response.status, 404);
                    return;
                }
                assert(false);
            });
        });

        describe('put ', function() {
            it('should put', async function() {
                const expectedDto = {
                    title: "anothertitle",
                    user: "anotheruser",
                    password: "anotherpassword"
                };

                let response = await axios.put(`/${dto.id}`, expectedDto);

                assert(response.status === 204);
            });

            it('should put and get', async function() {
                const expectedDto = {
                    title: "anothertitle",
                    user: "anotheruser",
                    password: "anotherpassword"
                };

                await axios.put(`/${dto.id}`, expectedDto);

                let response = await axios.get(`/${dto.id}`);
                let res = response.data;
                let resDto = {
                    id: res.id,
                    title: res.title,
                    user: res.user,
                    password: res.password
                };
                expectedDto.id = dto.id;
                assert.deepEqual(resDto, expectedDto);
            });
        });

        describe('delete ', function() {
            it('should not fail to delete non-existent', async function() {
                const nonExistentId = 123123123;
                let response = await axios.delete(`/${nonExistentId}`);

                assert(response.status === 204);
            });

            it('should delete', async function() {
                let response = await axios.delete(`/${dto.id}`);

                assert(response.status === 204);

                try {
                    await axios.get(`/${dto.id}`);
                } catch (err) {
                    assert(err.response.status === 404);
                    return;
                }
                assert(false);
            });
        });
    });
});

