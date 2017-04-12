import _ from 'lodash';

/**
 * All properties of all objects from arr2 are merged (extended) to arr1.
 * @param {Object[]} arr1 Array to merge to
 * @param {Object[]} arr2 Array to merge from
 * @param {string} [prop=id] Determines uniqueness of objects by value of specified property
 * @param {Function} [ctor] Function to construct default element to push into arr1 if element from arr2 is not found in arr1
 */
export function merge_arrays_of_objects(arr1, arr2, prop, ctor) {
    prop = prop || 'id';
    arr2.forEach(function (element) {
        let item = arr1.find(item => item[prop] === element[prop]);
        if (item === undefined) {
            item = ctor === undefined ? {} : ctor();
            _.extend(item, element);
            arr1.push(item);
        } else {
            _.extend(item, element);
        }
    }, this);
    let ids_to_remove = arr1
        .map(i => i.id)
        .filter(i => i !== undefined)
        .filter(i => arr2.find(j => j.id === i) === undefined);
    ids_to_remove.forEach(i => {
        let index_to_remove = arr1.findIndex(j => j.id === i);
        arr1.splice(index_to_remove, 1);
    });
}

/**
 * @returns {string} Newly created unique id
 */
export function generateUniqueId() {
    return _.uniqueId();
}

/**
 * Makes async function to be 'singleton'. If it is called before last call is finished (before Promise is resolved/rejected),
 * then it simply returns Promise from last call instead of executing again. Has property functions watch and unwatch to allow
 * to register callbacks to be called when `is_executing` value is changed.
 * @param {function} fn Async function (expected to return Promise)
 * @returns {function} Proxified async function and only one instance of it can be running at the same time
 */
export function make_fn_singleton(fn) {
    function on_any(val) {
        last_op.is_fulfilled = true;
        watched.forEach(w => w());
        return val;
    }

    let last_op = {
        promise: undefined,
        is_fulfilled: undefined
    };

    let watched = [];
    let unwatch = function (w) {
        _.pull(watched, w);
    };
    let watch = function (w) {
        watched.push(w);
        return function () {
            unwatch(w);
        };
    };

    let is_executing = function () {
        return last_op.is_fulfilled === false;
    };

    let res = function () {
        if (last_op.promise === undefined || last_op.is_fulfilled) {
            last_op.is_fulfilled = false;
            last_op.promise = fn.call(this).then(on_any, on_any);
            watched.forEach(w => w());
            return last_op.promise;
        }
        return last_op.promise;
    };
    res.watch = watch;
    res.unwatch = unwatch;
    res.is_executing = is_executing;

    return res;
}
