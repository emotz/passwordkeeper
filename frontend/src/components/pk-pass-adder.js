
import * as PassValidator from 'src/pass-validator.js';

export default {
    data: function() {
        return {
            title: "",
            title_error: false,
            user: "",
            user_error: false,
            password: "",
            show_password: false
        };
    },
    methods: {
        add: function() {
            let item_to_add = {
                title: this.title,
                user: this.user,
                password: this.password
            };

            let validation_result = PassValidator.validate(item_to_add);
            if (validation_result.title_errors.length > 0) this.title_error = true;
            if (validation_result.user_errors.length > 0) this.user_error = true;
            if (validation_result.is_valid()) {
                this.$emit('added', item_to_add);
            }
        }
    },
    watch: {
        title: function(val) {
            this.title_error = false;
        },
        user: function(val) {
            this.user_error = false;
        }
    }
};
