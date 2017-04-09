<template>
    <button class="pk-async-button"
            :id="`pk-async-button-${_uid}`"
            :disabled="!canExecute || executing"
            @click="execute">
        <span v-show="executing"><slot name="executing"></slot></span>
        <span v-show="!executing"><slot name="notexecuting"></slot></span>
        <slot></slot>
    </button>
</template>

<script src="./pk-async-button.js"></script>