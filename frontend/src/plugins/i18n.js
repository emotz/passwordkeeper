import Vue from 'vue';
import VueI18n from 'vue-i18n';

import * as loader from 'src/services/loader.js';
import { watch } from 'src/services/watch.js';
import ClientStore from 'src/client-store.js';

import error from 'src/error.js';

const locales = {
    'ru': loader.import_async((resolve, reject) => require(['src/i18ns/ru.js'], resolve.default, reject)),
    'en': require('src/i18ns/en.js').default
};
let last_locale;

Vue.use(VueI18n);

for (let lang in locales) {
    // Vue.locale starts download immediately even if it is function, so we dont assign anything here
    if (locales[lang] instanceof Function) continue;
    Vue.locale(lang, locales[lang]);
}
Vue.config.fallbackLang = 'en';

let client_store = new ClientStore('lang');
let stored_locale = client_store.get();
if (stored_locale !== undefined) {
    set_locale(stored_locale);
}
watch(get_locale, (new_locale, old_locale) => {
    client_store.set(new_locale);
});

/**
 * It might not change locale immediately - if locale is not yet available, it is downloaded first.
 * If it is changed again before download is finished, then locale won't change after download.
 * @param {string} new_locale New locale to set, e.g. "ru".
 */
export function set_locale(new_locale) {
    last_locale = new_locale;
    if (locales[new_locale] instanceof Function) {
        if (!Vue.locale(new_locale)) {
            // if we call set_locale for same locale before last one finishes, it goes here again
            // but no second network request because webpack is smart so its okay
            Vue.locale(new_locale, locales[new_locale], function() {
                // If we change locale while loading another one, we dont actually want to switch
                if (new_locale === last_locale) {
                    Vue.config.lang = last_locale;
                }
            });
        } else {
            Vue.config.lang = new_locale;
        }
    } else {
        Vue.config.lang = new_locale;
    }
}

/**
 * Reactive
 */
export function get_locale() {
    return Vue.config.lang;
}

/**
 * WARNING Not reactive
 */
export function get_locales() {
    return Object.keys(locales);
}

/**
 * Reactive
 */
export const t = Vue.t.bind(Vue);

/**
 * WARNING Not reactive
 * This is "Translation Error", not "Terror"
 */
export function terror(err) {
    const trans_id = `error.${err.code}.${err.type || 'default'}`;
    console.log('trans_id', trans_id);
    console.log('msg', err.message);

    return t(trans_id, { msg: (err.message || '') });
}
