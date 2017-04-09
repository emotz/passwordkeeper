
import * as PassValidator from 'src/pass-validator.js';
import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['item', 'show'],
    data() {
        let item = this.item === undefined ? {} : this.item;
        return {
            title: item.title,
            user: item.user,
            password: item.password,
            title_error: false,
            user_error: false,
            show_password: false
        };
    },
    methods: {
        ok() {
            let item_to_add = {
                title: this.title,
                user: this.user,
                password: this.password
            };

            let validation_result = PassValidator.validate(item_to_add);
            if (validation_result.title_errors.length > 0) this.title_error = true;
            if (validation_result.user_errors.length > 0) this.user_error = true;
            if (validation_result.is_valid()) {
                this.$emit('edit', item_to_add);
            }
        },
        cancel() {
            this.$emit("cancel");
        }
    },
    watch: {
        'item.title'(val) {
            this.title_error = false;
            this.title = val;
        },
        'item.user'(val) {
            this.user_error = false;
            this.user = val;
        },
        'item.password'(val) {
            this.password = val;
        }
    }
};
