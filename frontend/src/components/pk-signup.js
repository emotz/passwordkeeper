import * as auth from 'src/services/auth.js';
import { Modal } from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    data() {
        return {
            username: "",
            email: "",
            password: "",
            show_password: false
        };
    },
    methods: {
        async ok() {
            let user_to_add = {
                username: this.username,
                email: this.email,
                password: this.password
            };
            await auth.signup(user_to_add);
            this.$emit("ok", user_to_add);
        },
        cancel() {
            this.$emit("cancel");
        }
    }
};
