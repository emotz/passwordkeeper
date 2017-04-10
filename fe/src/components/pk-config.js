import * as i18n from 'src/plugins/i18n.js';

export default {
    data() {
        return {
            locales: i18n.get_locales()
        };
    },
    computed: {
        locale: {
            get() {
                return i18n.get_locale();
            },
            set(new_locale) {
                i18n.set_locale(new_locale);
            }
        }
    },
};
