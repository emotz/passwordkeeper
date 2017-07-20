import * as auth from 'src/services/auth.js';
import PkSignUp from './pk-signup.vue';
import PkSignIn from './pk-signin.vue';

import * as modal from 'src/services/modal.js';

export default {
    methods: {
        signin() {
            modal.open(PkSignIn);
        },
        signup() {
            modal.open(PkSignUp);
        },
        signout() {
            return auth.logout();
        }
    },
    computed: {
        authenticated: auth.is_authenticated
    }
};
