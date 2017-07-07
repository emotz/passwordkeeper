<template>
    <ul class="pk-sign navbar-form navbar-right"
        :id="`pk-sign-${_uid}`">
        <pk-sign-up :show="show"
            @cancel="show = false"></pk-sign-up>
        <pk-sign-in :showsignin="showsignin"
            @cancel="showsignin = false"></pk-sign-in>
        <div v-if="!authenticated"
              style="display: inline">
            <button class="pk-btn-signin btn btn-success"
                    @click="showsignin = true">
                <slot>{{ $t('signin') }}</slot>
            </button>
            <button class="pk-btn-signup btn btn-success"
                @click="show = true">
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