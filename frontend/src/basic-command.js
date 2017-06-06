import Command from './command.js';
import * as loader from 'src/services/loader.js';

/**
 * @typedef {Object} Options
 * @property {function|string} success_msg
 * @property {function|string} error_msg
 */

export default class BasicCommand extends Command {
    /**
     * 
     * @param {function} action 
     * @param {Options} options
     */
    constructor(action, options = {}) {
        super();
        this._action = action;
        this._success_msg = options.success_msg;
        this._error_msg = options.error_msg;
    }
    execute(...args) {
        return loader.perform(
            this._execute(this._action, ...args),
            this._success_msg,
            this._error_msg);
    }
}
