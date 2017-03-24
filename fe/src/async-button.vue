<template>
    <button :disabled="!canExecute"
            @click="execute">
        <slot v-show="executing"
              name="executing"></slot>
        <slot v-show="!executing"
              name="notexecuting"></slot>
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
            this.action().then(val => {
                this.$emit('success', val);
            }, val => {
                this.$emit('failure', val);
            });
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