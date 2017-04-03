import progressbar from './progressbar.js';
import * as notify from './notify.js';

/**
 * Decorates function to show progressbar during execution and show notification when finished. 
 * @see perform
 * @param {function} fn Function or Promise to execute
 * @param {function} [before_ok] Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {function} [before_err] Callback to get just before showing notification. Can be used to modify displayed notification
 * @returns {function} Decorated function
 */
export function decorate(fn, before_ok, before_err) {
    return function (...args) {
        return perform(fn, before_ok, before_err, this, ...args);
    };
}

/**
 * @see decorate
 */
export function decorate_without_success_notify(fn, ...args) {
    return decorate(fn, () => undefined, ...args);
}

/**
 * Shows progressbar during execution and shows notification when finished.
 * @param {*} fn Function or Promise to execute
 * @param {function} [before_ok] Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {function} [before_err] Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {*} [context] Context to call fn with
 * @param {*} [args] Arguments to pass to fn
 * @returns {*} Whatever value that was returned by fn
 */
export function perform(fn, before_ok, before_err, context, ...args) {
    let res = progressbar.wrap(fn, context, ...args);
    res
        .then(before_ok, before_err)
        .then(val => {
            if (val !== undefined) {
                notify.success(val);
            }
            return val;
        }, err => {
            if (err !== undefined) {
                notify.error(err);
            }
            throw err;
        });
    return res;
}
