<template>
    <div class="pass-editor"
         :id="`pass-editor-${_uid}`">
        <modal title="Edit password entry"
               :show="show_modal()"
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
                       v-model="editable_title">
            </div>
            <div class="form-group"
                 :class="{'has-error': user_error}">
                <label class="control-label"
                       :for="`user-input-${_uid}`">User</label>
                <input type="text"
                       class="user-input form-control"
                       :id="`user-input-${_uid}`"
                       placeholder="jane.doe@example.com"
                       v-model="editable_user">
            </div>
            <div class="form-group">
                <!--TODO get rid of hardcoded ids ? wouldnt be able to reuse component-->
                <label :for="`pass-input-${_uid}`">Password</label>
                <div class="input-group">
                    <input v-if="show_password"
                           type="text"
                           class="pass-input form-control"
                           :id="`pass-input-${_uid}`"
                           placeholder="Password123"
                           v-model="editable_password">
                    <input v-else
                           type="password"
                           class="pass-input form-control"
                           :id="`pass-input-${_uid}`"
                           placeholder="Password123"
                           v-model="editable_password">
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

import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['title', 'user', 'password', 'show'],
    data: function () {
        return {
            editable_title: this.title,
            editable_user: this.user,
            editable_password: this.password,
            title_error: false,
            user_error: false,
            show_password: false
        };
    },
    methods: {
        show_modal: function () {
            return this.show;
        },
        ok: function () {
            if (this.editable_title.length <= 0) this.title_error = true;
            if (this.editable_user.length <= 0) this.user_error = true;
            if (this.editable_title.length > 0 && this.editable_user.length > 0) {
                this.$emit('edit', {
                    title: this.editable_title,
                    user: this.editable_user,
                    password: this.editable_password
                });
            }
        },
        cancel: function () {
            this.$emit("cancel");
        }
    },
    watch: {
        title: function (val) {
            this.title_error = false;
            this.editable_title = val;
        },
        user: function (val) {
            this.user_error = false;
            this.editable_user = val;
        },
        password: function (val) {
            this.editable_password = val;
        }
    }
}
</script>