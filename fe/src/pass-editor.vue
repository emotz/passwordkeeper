<template>
    <div class="pass-editor"
         :id="`pass-editor-${_uid}`">
        <modal title="Edit password entry"
               :show="show"
               @ok="ok"
               @cancel="cancel">
            <div class="form-group"
                 :class="{'has-error': title_error}">
                <label class="control-label"
                       :for="`title-input-${_uid}`">Title</label>
                <input type="text"
                       class="title-input form-control"
                       :id="`title-input-${_uid}`"
                       placeholder="mysite.com"
                       v-model="title">
            </div>
            <div class="form-group"
                 :class="{'has-error': user_error}">
                <label class="control-label"
                       :for="`user-input-${_uid}`">User</label>
                <input type="text"
                       class="user-input form-control"
                       :id="`user-input-${_uid}`"
                       placeholder="jane.doe@example.com"
                       v-model="user">
            </div>
            <div class="form-group">
                <label :for="`pass-input-${_uid}`">Password</label>
                <div class="input-group">
                    <input v-if="show_password"
                           type="text"
                           class="pass-input form-control"
                           :id="`pass-input-${_uid}`"
                           placeholder="Password123"
                           v-model="password">
                    <input v-else
                           type="password"
                           class="pass-input form-control"
                           :id="`pass-input-${_uid}`"
                           placeholder="Password123"
                           v-model="password">
                    <div class="btn btn-default input-group-addon"
                         @click="show_password = !show_password"
                         :class="{'active': show_password}"
                         :aria-pressed="show_password"><span class="fa fa-eye"></span></div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import * as PassValidator from './pass-validator.js';
import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['item', 'show'],
    data: function () {
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
        ok: function () {
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
        cancel: function () {
            this.$emit("cancel");
        }
    },
    watch: {
        'item.title': function (val) {
            this.title_error = false;
            this.title = val;
        },
        'item.user': function (val) {
            this.user_error = false;
            this.user = val;
        },
        'item.password': function (val) {
            this.password = val;
        }
    }
}
</script>