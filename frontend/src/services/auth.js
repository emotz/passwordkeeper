import { http } from 'src/plugins/http.js';
import { Command, execute } from 'command-decorator';
import { make_reactive } from './watch.js';
import { notify_error } from 'src/services/loader.js';

const API_TOKEN_URL = "/api/token";
const API_USERS_URL = "/api/users";

const data = make_reactive({
    token: undefined
});

class AuthCommand extends Command {
    @notify_error
    @execute
    async login(username, password) {
        let response = await http.post(API_TOKEN_URL, { username, password });
        // TODO handle errors
        set_token(response.data.access_token);
        return response;
    }

    @notify_error
    @execute
    async logout() {
        try {
            return await http.delete(API_TOKEN_URL);
        } finally {
            remove_token();
        }
    }

    @notify_error
    @execute
    async signup(input) {
        // TODO finish this signup
        let response = await http.post(API_USERS_URL, input);
        // TODO: validate token
        set_token(response.data.access_token);
        return response;
    }
}

export const auth_cmd = new AuthCommand();

export const login = auth_cmd.login.bind(auth_cmd);
export const logout = auth_cmd.logout.bind(auth_cmd);
export const signup = auth_cmd.signup.bind(auth_cmd);

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
