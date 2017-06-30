<template>
    <ul class="pk-signin navbar-form navbar-right"
        :id="`pk-signin-${_uid}`">
        <pk-sign-up :show="show"
            @cancel="show = false"></pk-sign-up>
        <form v-if="!authenticated"
              style="display: inline">
            <div class="form-group"
                 :class="{'has-error': user_error}">
                <input type="text"
                       :placeholder="$t('signin_user_placeholder')"
                       class="pk-signin-user-input form-control"
                       v-model="user">
            </div>
            <div class="form-group"
                 :class="{'has-error': password_error}">
                <input type="password"
                       :placeholder="$t('signin_pass_placeholder')"
                       class="pk-signin-pass-input form-control"
                       v-model="password">
            </div>
            <button class="pk-btn-signin btn btn-success"
                    type="submit"
                    :disabled="can_signin"
                    @click="signin">
                <slot>{{ $t('signin') }}</slot>
            </button>
        </form>
        <button v-else
                class="pk-btn-signout btn btn-default"
                @click="signout">
            <slot>{{ $t('signout') }}</slot>
        </button>
        <button class="pk-btn-signup btn btn-success"
                @click="show = true">
            <slot>{{ $t('signup') }}</slot>
        </button>
    </ul>
</template>

<script src="./pk-signin.js"></script>