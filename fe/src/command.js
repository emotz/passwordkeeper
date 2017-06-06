import { make_reactive } from 'src/services/watch.js';

export default class Command {
    constructor() {
        /** @type {CommandGroup} */
        this._group = undefined;
        this._reactive = make_reactive({
            is_executing: false,
            promise: undefined
        });
    }

    /**
     * Reactive
     */
    is_executing() {
        return this._reactive.is_executing;
    }

    /**
     * 
     * @param {CommandGroup} group 
     */
    set_group(group) {
        this._group = group;
        this._group.add_command(this);
    }

    validate_execute() {
        if (this.is_executing()) throw new Error("already executing");
        if (this._group !== undefined && this._group.is_executing()) {
            throw new Error("another in group already executing");
        }
    }

    can_execute() {
        try {
            this.validate_execute();
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Reactive
     */
    promise() {
        return this._reactive.promise;
    }

    async _execute(fn, ...args) {
        this.validate_execute();
        this._reactive.is_executing = true;
        try {
            this._reactive.promise = fn(...args);
            return await this._reactive.promise;
        } finally {
            this._reactive.is_executing = false;
        }
    }
}
