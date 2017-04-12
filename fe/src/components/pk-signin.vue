<template>
    <ul class="pk-signin navbar-form navbar-right"
        :id="`pk-signin-${_uid}`">
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
            <pk-async-button class="pk-btn-signin btn btn-success"
                             type="submit"
                             :can-execute="true"
                             :action="signin">
                <slot>{{ $t('signin') }}</slot>
            </pk-async-button>
        </form>
        <pk-async-button v-else
                         class="pk-btn-signout btn btn-default"
                         :can-execute="true"
                         :action="signout">
            <slot>{{ $t('signout') }}</slot>
        </pk-async-button>
    </ul>
</template>

<script src="./pk-signin.js"></script>