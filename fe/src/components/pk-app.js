import PkAppNav from './pk-app-nav.vue';
import router from 'src/plugins/router.js';
import store from 'src/plugins/store.js';

export default {
    components: { PkAppNav },
    data: {
        project_name: "Password Keeper"
    },
    router,
    store
};
