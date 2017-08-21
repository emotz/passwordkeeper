import * as auth from 'src/services/auth.js';
import PkSignUp from './pk-signup.vue';
import PkSignIn from './pk-signin.vue';

import * as modal from 'src/services/modal.js';

export default {
    methods: {
        signin() {
            modal.open(PkSignIn);
        },
        async signup() {
            const user = await modal.open(PkSignUp);
            await auth.login(user.username, user.password);
        },
        signout() {
            return auth.logout();
        }
    },
    computed: {
        authenticated: auth.is_authenticated
    }
};
