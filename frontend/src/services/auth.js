import { http } from 'src/plugins/http.js';
import Command from 'src/command.js';
import { make_reactive } from './watch.js';

const API_TOKEN_URL = "/api/token";
const API_USERS_URL = "/api/users";
const API_LOGIN_URL = "/api/login";

const data = make_reactive({
    token: undefined
});

export const login_cmd = new (class LoginCommand extends Command {
    execute(user, password) {
        return this._execute(async () => {
            let response = await http.post(API_LOGIN_URL, { user, password });
            set_token(response.data.access_token);
            return response;
        });
    }
}) ();

export async function signup(input) {
    // TODO finish this signup
    let response = await http.post(API_USERS_URL, input);
    // TODO: validate token
    set_token(response.data.access_token);
    return response;
}

export async function logout() {
    try {
        return await http.delete(API_TOKEN_URL);
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

