import * as progressbar from './progressbar.js';
import * as notify from './notify.js';
import * as i18n from 'src/plugins/i18n.js';
import _ from 'lodash';

/**
 * Proper JS Decorator to show error messages if function fails.
 */
export function loader(map_success_text, map_error_text) {
    // TODO rename it to something with "notify"
    return function(target, property_key, descriptor) {
        const old_method = descriptor.value;
        descriptor.value = decorate(old_method, map_success_text, map_error_text);
    };
}

/**
 * Proper JS Decorator to show error messages if function fails.
 */
export function notify_error(target, property_key, descriptor) {
    const old_method = descriptor.value;
    descriptor.value = decorate_without_success_notify(old_method);
}

/**
 * Decorates function to show progressbar during execution and show notification when finished.
 * @see perform
 * @param {function} fn Function or Promise to execute
 * @param {Function|String} [map_success_text] Function to modify displayed notification for success case (or just text to display)
 * @param {Function|String} [map_error_text] Function to modify displayed notification for error case (or just text to display)
 * @returns {function} Decorated function
 */
export function decorate(fn, map_success_text, map_error_text) {
    return function(...args) {
        return perform(fn, map_success_text, map_error_text, this, ...args);
    };
}

/**
 * @see decorate
 */
export function decorate_without_success_notify(fn, ...args) {
    return decorate(fn, () => undefined, ...args);
}

/**
 *
 * @param {Function} fn Function to call async import
 */
export function import_async(fn) {
    return decorate_without_success_notify(() => new Promise((resolve, reject) => {
        let wrapped = val => resolve(val);
        wrapped.default = val => wrapped(val.default);
        fn(wrapped, reject);
    }));
}

/**
 * Shows progressbar during execution and shows notification when finished.
 * @param {*} fn Function or Promise to execute
 * @param {Function|String} [map_success_text] Function to modify displayed notification for success case (or just text to display)
 * @param {Function|String} [map_error_text] Function to modify displayed notification for error case (or just text to display)
 * @param {*} [context] Context to call fn with
 * @param {*} [args] Arguments to pass to fn
 * @returns {*} Whatever value that was returned by fn
 */
export function perform(fn, map_success_text, map_error_text, context, ...args) {
    map_success_text = map_success_text === undefined ? _.identity : map_success_text;
    map_error_text = map_error_text === undefined ? i18n.terror : map_error_text;
    const res = progressbar.wrap(fn, context, ...args);
    return res
        .then(val => {
            const val2show = map_success_text instanceof Function ? map_success_text(val) : map_success_text;
            if (val2show !== undefined) {
                notify.success(val2show);
            }
            return val;
        }, err => {
            const val2show = map_error_text instanceof Function ? map_error_text(err) : map_error_text;
            if (val2show !== undefined) {
                notify.error(val2show);
            }
            throw err;
        });
}
