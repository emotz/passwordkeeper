<template>
    <div class="pk-pass-adder form-inline"
         :id="`pk-pass-adder-${_uid}`">
        <div class="form-group"
             :class="{'has-error': title_error}">
            <label class="control-label"
                   :for="`pk-title-input-${_uid}`">{{ $formatMessage({id: 'label_title'}) }}</label>
            <input type="text"
                   class="pk-title-input form-control"
                   :id="`pk-title-input-${_uid}`"
                   placeholder="mysite.com"
                   v-model="title">
        </div>
        <div class="form-group"
             :class="{'has-error': user_error}">
            <label class="control-label"
                   :for="`pk-user-input-${_uid}`">{{ $formatMessage({id: 'label_user'}) }}</label>
            <input type="text"
                   class="pk-user-input form-control"
                   :id="`pk-user-input-${_uid}`"
                   placeholder="jane.doe@example.com"
                   v-model="user">
        </div>
        <div class="form-group">
            <label :for="`pass-input-${_uid}`">{{ $formatMessage({id: 'label_password'}) }}</label>
            <div class="input-group">
                <input v-if="show_password"
                       type="text"
                       class="pk-pass-input form-control"
                       :id="`pk-pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <input v-else
                       type="password"
                       class="pk-pass-input form-control"
                       :id="`pk-pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <div class="btn btn-default input-group-addon"
                     @click="show_password = !show_password"
                     :class="{'active': show_password}"
                     :aria-pressed="show_password"><span class="fa fa-eye"></span></div>
            </div>
        </div>
        <button class="btn btn-default pk-btn-pass-add"
                :id="`pk-pass-add-${_uid}`"
                @click="add"><span class="fa fa-plus force-parent-lh"></span></button>
    </div>
</template>

<script>
import * as PassValidator from 'src/pass-validator.js';

export default {
    data: function () {
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
        add: function () {
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
        title: function (val) {
            this.title_error = false;
        },
        user: function (val) {
            this.user_error = false;
        }
    }
}
</script>