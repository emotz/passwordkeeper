import Vue from 'vue';
import VueI18n from 'vue-i18n';

import * as loader from 'src/services/loader.js';

Vue.use(VueI18n);
const locales = {
    'ru': loader.import_async((resolve, reject) => require(['src/i18ns/ru.js'], resolve.default, reject)),
    'en': require('src/i18ns/en.js').default
};
for (let lang in locales) {
    if (locales[lang] instanceof Function) continue;
    Vue.locale(lang, locales[lang]);
}
Vue.config.fallbackLang = 'en';

let last_locale;
/**
 * Don't use this directly, modify store instead `this.$store.commit("locale/set_locale", new_locale)`.
 * @param {string} new_locale New locale to set, e.g. "ru".
 * @example
 * import * as i18n from 'src/plugins/i18n.js';
 * i18n.set_locale("ru");
 */
export function set_locale(new_locale) {
    last_locale = new_locale;
    if (locales[new_locale] instanceof Function) {
        if (!Vue.locale(new_locale)) {
            // if we call set_locale for same locale before last one finishes, it goes here again
            // but no second network request because webpack is smart so its okay
            Vue.locale(new_locale, locales[new_locale], function () {
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

export function get_locales() {
    return Object.keys(locales);
}

export function t(msg) {
    return Vue.t(msg);
}
