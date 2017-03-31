import progressbar from './progressbar.js';
import notify from './notify.js';

/**
 * Decorates function to show progressbar before executing and showing notification when finished. 
 * @param {function} fn Function or Promise to execute
 * @param {function} before_ok Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {function} before_err Callback to get just before showing notification. Can be used to modify displayed notification
 * @returns {function} Decorated function
 */
function decorate(fn, before_ok, before_err) {
    return function (...args) {
        return perform(fn, before_ok, before_err, this, ...args);
    };
}

/**
 * @see decorate
 */
function decorate_without_success_notify(fn, ...args) {
    return decorate(fn, () => undefined, ...args);
}

/**
 * Shows progressbar before executing and shows notification when finished.
 * @param {*} fn Function or Promise to execute
 * @param {function} before_ok Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {function} before_err Callback to get just before showing notification. Can be used to modify displayed notification
 * @param {*} context Context to call fn with
 * @param {*} args Arguments to pass to fn
 * @returns {*} Whatever value that was returned by fn
 */
function perform(fn, before_ok, before_err, context, ...args) {
    progressbar.start();
    let res = Promise.resolve(fn instanceof Function ? fn.apply(context, args) : fn);
    res
        .then(before_ok, before_err)
        .then(function (val) {
            progressbar.stop();
            if (val !== undefined) {
                notify.success(val);
            }
            return val;
        }, function (err) {
            progressbar.stop();
            if (err !== undefined) {
                notify.error(err);
            }
            throw err;
        });
    return res;
}

export default { decorate, decorate_without_success_notify, perform };