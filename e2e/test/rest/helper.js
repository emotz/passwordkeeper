const axios = require('axios');
const url = require('url');
const utls = require('./utls.js');
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
        login: user.username,
        password: user.password
    });
    return response.data.access_token;
}

async function addAnyPassEntry(axios) {
    const user = utls.generateUniqueString();
    const title = utls.generateUniqueString();
    const password = utls.generateUniqueString();
    return await addPassEntry(axios, { title, user, password });
}

async function addPassEntry(axios, dto) {
    let api = url.resolve(config.baseUrl, '/api/entries');
    let response = await axios.post(api, {
        title: dto.title,
        user: dto.user,
        password: dto.password
    });

    const id = utls.parseEntryIdFromLocationHeader(response.headers.location);
    return id;
}

module.exports = {
    addAnyPassEntry,
    signinWithSignup,
    signup
};
