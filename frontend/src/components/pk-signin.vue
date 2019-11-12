<template>
    <div class="pk-signin"
        :id="`pk-signin-${_uid}`">
        <modal :show="true"
              @ok="ok"
              @cancel="cancel">
            <span slot="title">{{ $t('signin_title') }}</span>
            <span slot="button_ok">{{ $t('button_ok') }}</span>
            <span slot="button_cancel">{{ $t('button_cancel') }}</span>

            <div class="form-group">
                <label class="control-label"
                      :for="`pk-signin-login-input-${_uid}`">{{ $t('label_login') }}</label>
                <input type="text"
                      class="pk-signin-login-input form-control"
                      :id="`pk-signin-login-input-${_uid}`"
                      placeholder="User or e-mail"
                      v-model="login">
            </div>
            <div class="form-group">
                <label :for="`pk-signin-pass-input-${_uid}`">{{ $t('label_password') }}</label>
                <div class="input-group">
                    <input v-if="show_password"
                          type="text"
                          class="pk-signin-pass-input form-control"
                          :id="`pk-signin-pass-input-${_uid}`"
                          placeholder="Password123"
                          v-model="password">
                    <input v-else
                          type="password"
                          class="pk-signin-pass-input form-control"
                          :id="`pk-signin-pass-input-${_uid}`"
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
