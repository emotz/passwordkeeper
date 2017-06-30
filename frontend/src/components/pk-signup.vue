<template>
    <div class="pk-signup"
         :id="`pk-signup-${_uid}`">
        <modal :title="$t('signup_title')"
               :show="show"
               @ok="ok"
               @cancel="cancel"
               okClass="btn btn-primary pk-btn-signup-ok"
               :okText="$t('button_ok')"
               :cancelText="$t('button_cancel')">
            <div class="form-group"
                 :class="{'has-error': username_error}">
                <label class="control-label"
                       :for="`pk-username-input-${_uid}`">{{ $t('label_username') }}</label>
                <input type="text"
                       class="pk-username-input form-control"
                       :id="`pk-username-input-${_uid}`"
                       placeholder="UserName"
                       v-model="username">
            </div>
            <div class="form-group"
                 :class="{'has-error': email_error}">
                <label class="control-label"
                       :for="`pk-email-input-${_uid}`">{{ $t('label_email') }}</label>
                <input type="text"
                       class="pk-email-input form-control"
                       :id="`pk-email-input-${_uid}`"
                       placeholder="jane.doe@example.com"
                       v-model="email">
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

<script src="./pk-signup.js"></script>