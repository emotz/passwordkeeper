import _ from 'lodash';

/**
 * All properties of all objects from arr2 are merged (extended) to arr1.
 * @param {Object[]} arr1 Array to merge to
 * @param {Object[]} arr2 Array to merge from
 * @param {string} [prop=id] Determines uniqueness of objects by value of specified property
 * @param {Function} [ctor] Function to construct default element to push into arr1 if element from arr2 is not found in arr1
 */
function merge_arrays_of_objects(arr1, arr2, prop, ctor) {
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
function generateUniqueId() {
    return _.uniqueId();
}

/**
 * Makes async function to be 'singleton'. If it is called before last call is finished (before Promise is resolved/rejected),
 * then it simply returns Promise from last call instead of executing again. Has property functions watch and unwatch to allow
 * to register callbacks on before action execution.
 * @param {function} fn Async function (expected to return Promise)
 * @returns {function} Proxified async function and only one instance of it can be running at the same time
 */
function make_fn_singleton(fn) {
    function on_any(val) {
        fn.last_op.is_fulfilled = true;
        return val;
    }

    fn.last_op = {
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

    let res = function () {
        if (fn.last_op.promise === undefined || fn.last_op.is_fulfilled) {
            fn.last_op.is_fulfilled = false;
            fn.last_op.promise = fn.apply(this).then(on_any, on_any);
            watched.forEach(w => w());
            return fn.last_op.promise;
        }
        return fn.last_op.promise;
    };
    res.watch = watch;
    res.unwatch = unwatch;

    return res;
}

export { merge_arrays_of_objects, generateUniqueId, make_fn_singleton };
