<template>
    <div class="pk-signin"
         :id="`pk-signin-${_uid}`">
        <modal :title="$t('signin_title')"
               :show="showsignin"
               @ok="signin"
               @cancel="cancel"
               okClass="btn btn-primary pk-btn-editor-ok"
               :okText="$t('button_ok')"
               :cancelText="$t('button_cancel')">
            <div class="form-group"
                 :class="{'has-error': title_error}">
                <label class="control-label"
                       :for="`pk-user-input-${_uid}`">{{ $t('label_user') }}</label>
                <input type="text"
                       class="pk-user-input form-control"
                       :id="`pk-user-input-${_uid}`"
                       placeholder="User or e-mail"
                       v-model="username">
            </div>
            <div class="form-group">
                <label :for="`pk-pass-input-${_uid}`">{{ $t('label_password') }}</label>
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
        </modal>
    </div>
</template>

<script src="./pk-signin.js"></script>