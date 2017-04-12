import Vue from 'vue';

import * as i18n from './i18n.js';
import * as auth from './auth.js';

const KEY_LANG = 'PkLang';
const KEY_TOKEN = 'PkToken';

let client_store = new Vue({
    created() {
        let locale = get_item(KEY_LANG);
        if (locale !== undefined) {
            i18n.set_locale(locale);
        }
        this.$watch(i18n.get_locale, (new_locale, old_locale) => {
            set_item(KEY_LANG, new_locale);
        });

        let token = get_item(KEY_TOKEN);
        if (token !== undefined) {
            auth.set_token(token);
        }
        this.$watch(auth.get_token, (new_token, old_token) => {
            set_item(KEY_TOKEN, new_token);
        });
    }
});

export default client_store;

function get_item(key) {
    let val = window.localStorage.getItem(key);
    if (val === null) return undefined;
    return val;
}

function set_item(key, val) {
    if (val === undefined) remove_item(key);
    else window.localStorage.setItem(key, val);
}

function remove_item(key) {
    window.localStorage.removeItem(key);
}