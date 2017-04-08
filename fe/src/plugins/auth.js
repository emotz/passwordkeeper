import Vue from 'vue';
import VueResource from 'vue-resource';

import store from 'src/plugins/store.js';

const API_SESSION_URL = "/api/sessions";
const API_USERS_URL = "/api/users";

// let authenticated = validToken(getToken());
Vue.use(VueResource);
if (is_valid_token(get_token())) store.commit('auth/set_authenticated', true);

Vue.http.interceptors.push(function (request, next) {
    // TODO: should we pass authorization token for each request? may be only for requests which are required to have authorizatioN?
    let token = get_token();
    if (request.headers['Authorization'] === undefined && is_valid_token(token)) {
        request.headers.set('Authorization', `Bearer ${token}`);
    }
    next();
    // TODO: should have interceptor for Unauthorized response whatever to remove auth token
});

export async function login(user, password) {
    let response = await Vue.http.post(API_SESSION_URL, { user, password });
    // TODO: validate token
    set_token(response.data.access_token);
    return response;
}

export async function register(input) {
    let response = await Vue.http.post(API_USERS_URL, input);
    // TODO: validate token
    set_token(response.data.token);
    return response;
}

export async function logout() {
    let response = await Vue.http.delete(API_SESSION_URL);
    remove_token();
    return response;
}

function set_token(token) {
    window.localStorage.setItem("token", token);
    store.commit('auth/set_authenticated', true);
    // authenticated = true;
}

function remove_token() {
    window.localStorage.removeItem("token");
    store.commit('auth/set_authenticated', false);
    // authenticated = false;
}

function get_token() {
    return window.localStorage.getItem("token");
}

function is_valid_token(token) {
    if (token !== undefined && token != null) {
        return true;
    }
    return false;
}
