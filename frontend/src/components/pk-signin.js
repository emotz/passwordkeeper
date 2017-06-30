import * as auth from 'src/services/auth.js';
import PkSignUp from './pk-signup.vue';

export default {
    components: {
        PkSignUp
    },
    data() {
        return {
            user: "",
            user_error: false,
            password: "",
            password_error: false,
            show_password: false,
            show: false
        };
    },
    methods: {
        async signin() {
            let val;
            try {
                val = await auth.login_cmd.execute(this.user, this.password);
            } catch (err) {
                this.user_error = true;
                this.password_error = true;
                throw err;
            }
            this.user = "";
            this.password = "";
            return val;
        },
        signout() {
            return auth.logout();
        }
    },
    computed: {
        authenticated: auth.is_authenticated,
        can_signin() {
            return auth.login_cmd.is_executing();
        }
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