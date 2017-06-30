import * as PassValidator from 'src/pass-validator.js';
import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['user', 'show'],
    data() {
        let user = this.user === undefined ? {} : this.user;
        return {
            username: user.username,
            email: user.email,
            password: user.password,
            username_error: false,
            email_error: false,
            show_password: false
        };
    },
    methods: {
        ok() {
            let user_to_add = {
                username: this.username,
                email: this.email,
                password: this.password
            };

            let validation_result = PassValidator.validate(user_to_add);
            if (validation_result.username_errors.length > 0) this.username_error = true;
            if (validation_result.email_errors.length > 0) this.email_error = true;
            if (validation_result.is_valid()) {
                this.$emit('edit', user_to_add);
            }
        },
        cancel() {
            this.$emit("cancel");
        }
    },
    watch: {
        'user.username'(val) {
            this.username_error = false;
            this.username = val;
        },
        'user.email'(val) {
            this.email_error = false;
            this.email = val;
        },
        'user.password'(val) {
            this.password = val;
        }
    }
};