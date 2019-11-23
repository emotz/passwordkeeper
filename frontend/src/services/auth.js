import { Command, execute } from 'command-decorator';
import { http } from 'src/plugins/http.js';
import * as i18n from 'src/plugins/i18n.js';
import { notifier_error } from 'src/services/loader.js';
import * as logger from 'src/services/logger.js';
import { make_reactive } from './watch.js';

const API_TOKEN_URL = "/api/token";
const API_USERS_URL = "/api/users";

const data = make_reactive({
  status: "GUEST",
  token: undefined,
  login: undefined
});

// TODO change login and signup to the same signature?
class AuthCommand extends Command {
  @notifier_error(i18n.terror)
  @execute
  async login(login, password) {
    const response = await http.post(API_TOKEN_URL, { login, password });
    do_login(login, response.data.access_token);
    return response;
  }

  @notifier_error(i18n.terror)
  @execute
  async logout() {
    try {
      return await http.delete(API_TOKEN_URL);
    } finally {
      do_logout();
    }
  }

  @notifier_error(i18n.terror)
  @execute
  async signup(input) {
    const response = await http.post(API_USERS_URL, input);
    do_signup();
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

export function newly_logged() {
  if (data.status === 'NEWLY_LOGGED') {
    data.status = 'LOGGED';
  } else {
    logger.warn(new Error('should not happen, probably something bad is going on'));
  }
}

function do_login(login, token) {
  if (data.status === "AWAITING_LOGIN") {
    data.status = "NEWLY_LOGGED";
  } else {
    data.status = "LOGGED";
  }
  data.token = token;
  data.login = login;
}

function do_signup() {
  data.status = "AWAITING_LOGIN";
  data.token = undefined;
  data.login = undefined;
}

export function do_logout() {
  data.status = "GUEST";
  data.token = undefined;
  data.login = undefined;
}

/**
 * DO NOT use this function directly.
 */
export function set_authdata({ status, token, login }) {
  data.status = status;
  data.token = token;
  data.login = login;
}

/**
 * Reactive
 */
export function get_authdata() {
  return {
    status: data.status,
    token: data.token,
    login: data.login
  };
}

/**
 * Reactive
 */
export function get_token() {
  return data.token;
}

/**
 * Reactive
 */
export function get_status() {
  return data.status;
}

function is_valid_token(token) {
  return token != null;
}
