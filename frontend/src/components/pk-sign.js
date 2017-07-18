import * as auth from 'src/services/auth.js';
import PkSignUp from './pk-signup.vue';
import PkSignIn from './pk-signin.vue';

export default {
    components: {
        PkSignUp,
        PkSignIn
    },
    data() {
        return {
            user: "",
            user_error: false,
            password: "",
            password_error: false,
            show_password: false,
            show: false,
            showsignin: false
        };
    },
    methods: {
        signout() {
            return auth.logout();
        }
    },
    computed: {
        can_signin() {
            return auth.login_cmd.is_executing();
        },
        authenticated: auth.is_authenticated
    },
    watch: {
        user() {
            this.user_error = false;
        },
        password() {
            this.password_error = false;
        }
    }
};