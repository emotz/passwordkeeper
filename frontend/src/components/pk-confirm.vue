<template>
    <modal :show="true"
           @ok="ok"
           @cancel="cancel">
        <span slot="title">{{ $t('confirm_title') }}</span>
        <span slot="button_ok">{{ $t('button_ok') }}</span>
        <span slot="button_cancel">{{ $t('button_cancel') }}</span>
        {{ $t('confirm_text') }}
    </modal>
</template>

<script src="./pk-confirm.js"></script>