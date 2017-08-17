const axios = require('axios');
const url = require('url');
const config = require('../../wdio.conf.js').config;

async function signup(user) {
    let api = url.resolve(config.baseUrl, '/api/users');
    await axios.post(api, user);
}

async function signinWithSignup(user) {
    let api = url.resolve(config.baseUrl, '/api/users');
    let apiToken = url.resolve(config.baseUrl, '/api/token');
    await axios.post(api, user);
    let response = await axios.post(apiToken, {
        username: user.username,
        password: user.password
    });
    return response.data.access_token;
}

module.exports = {
    signinWithSignup,
    signup
};
