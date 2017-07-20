<template>
    <ul class="pk-sign navbar-form navbar-right"
        :id="`pk-sign-${_uid}`">
        <div v-if="!authenticated"
             style="display: inline">
            <button class="pk-btn-signin btn btn-success"
                    @click="signin">
                <slot>{{ $t('signin') }}</slot>
            </button>
            <button class="pk-btn-signup btn btn-success"
                    @click="signup">
                <slot>{{ $t('signup') }}</slot>
            </button>
        </div>
        <button v-else
                class="pk-btn-signout btn btn-default"
                @click="signout">
            <slot>{{ $t('signout') }}</slot>
        </button>
    </ul>
</template>

<script src="./pk-sign.js"></script>
