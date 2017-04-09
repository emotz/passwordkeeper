import PkAppNav from './pk-app-nav.vue';
import router from 'src/plugins/router.js';
import store from 'src/plugins/store.js';
import * as i18n from 'src/plugins/i18n.js';

export default {
    components: { PkAppNav },
    data: {
        project_name: "Password Keeper"
    },
    router,
    store,
    created() {
        if (this.$store.state.locale.locale === "") {
            let lang = window.localStorage.getItem('PkLang') || 'en';
            this.$store.commit('locale/set_locale', lang);
        }
    },
    watch: {
        '$store.state.locale.locale'(new_locale) {
            i18n.set_locale(new_locale);
            window.localStorage.setItem('PkLang', new_locale);
        }
    }
};
