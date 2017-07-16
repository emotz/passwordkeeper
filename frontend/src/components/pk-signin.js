import * as PassValidator from 'src/pass-validator.js';
import * as auth from 'src/services/auth.js';
import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['user', 'showsignin'],
    data() {
        let user = this.user === undefined ? {} : this.user;
        return {
            username: user.username,
            password: user.password,
            username_error: false,
            email_error: false,
            show_password: false
        };
    },
    methods: {
        async signin() {
            let val;
            try {
                val = await auth.login_cmd.execute(this.username, this.password);
            } catch (err) {
                this.user_error = true;
                this.password_error = true;
                throw err;
            }
            this.user = "";
            this.password = "";
            return val;
        },
        cancel() {
            this.$emit("cancel");
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