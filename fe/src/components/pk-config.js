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
                return this.$store.state.locale.locale;
            },
            set(new_locale) {
                this.$store.commit("locale/set_locale", new_locale);
            }
        }
    },
};
