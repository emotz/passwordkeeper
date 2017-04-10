import Vue from 'vue';

import * as i18n from './i18n.js';

const KEY_LANG = 'PkLang';

let client_store = new Vue({
    created() {
        let locale = get_item(KEY_LANG);
        if (locale !== undefined) {
            i18n.set_locale(locale);
        }
        this.$watch(i18n.get_locale, (new_locale, old_locale) => {
            set_item(KEY_LANG, new_locale);
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
    window.localStorage.setItem(key, val);
}