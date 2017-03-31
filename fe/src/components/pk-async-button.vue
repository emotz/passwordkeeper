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

<script>

export default {
    props: ['can-execute', 'action'], // TODO: object props (required etc)
    data: function () {
        this._unwatches = [];
        this._unwatches.push(this.action.watch(() => { this.executing = this.action.is_executing(); }));
        return {
            executing: this.action.is_executing(),
        };
    },
    methods: {
        execute: function () {
            this.$emit('promise', this.action());
        },
    },
    watch: {
        action: function (new_action, old_action) {
            for (let unw; uwn = this._unwatches.pop(); unw());
            // TODO: check memory leaks
            this.executing = new_action.is_executing();
            this._unwatches.push(new_action.watch(() => { this.executing = this.action.is_executing(); }));
        }
    }
}
</script>