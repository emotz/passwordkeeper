
export default {
    props: ['can-execute', 'action'],
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
            for (let unw; (unw = this._unwatches.pop()); unw());
            this.executing = new_action.is_executing();
            this._unwatches.push(new_action.watch(() => { this.executing = this.action.is_executing(); }));
        }
    }
};