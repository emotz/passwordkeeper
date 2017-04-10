import Vue from 'vue';
import VueResource from 'vue-resource';

const API_TOKEN_URL = "/api/token";
const API_USERS_URL = "/api/users";

// let authenticated = validToken(getToken());
Vue.use(VueResource);

const data = {
    token: undefined
};
new Vue({ data });

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
    let response = await Vue.http.post(API_TOKEN_URL, { user, password });
    // TODO: validate token
    set_token(response.data.access_token);
    return response;
}

export async function register(input) {
    let response = await Vue.http.post(API_USERS_URL, input);
    // TODO: validate token
    set_token(response.data.access_token);
    return response;
}

export async function logout() {
    try {
        return await Vue.http.delete(API_TOKEN_URL);
    } finally {
        remove_token();
    }
}

/**
 * Reactive
 */
export function is_authenticated() {
    return is_valid_token(data.token);
}

export function set_token(token) {
    data.token = token;
}

export function remove_token() {
    data.token = undefined;
}

/**
 * Reactive
 */
export function get_token() {
    return data.token;
}

function is_valid_token(token) {
    if (token !== undefined && token !== null) {
        return true;
    }
    return false;
}
