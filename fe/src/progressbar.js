import Vue from 'vue';
import VueResource from 'vue-resource';
import NProgress from 'nprogress';
import 'nprogress.css';
import './progressbar.css';

function start() {
    NProgress.start();
}

function stop() {
    NProgress.done();
}

function promise_hook(promise, fn) {
    return promise.then(function (val) {
        fn();
        return val;
    }, function (err) {
        fn();
        throw err;
    });
}

function decorate(fn) {
    return function (...args) {
        start();
        let res = fn(...args);
        if (res instanceof Promise) {
            promise_hook(res, stop);
            return res;
        }
        stop();
        return res;
    };
}

/**
 * 
 * @param {function} fn Must accept only one argument - resolve
 */
function decorate_resolve(fn) {
    return function (resolve) {
        start();
        return fn((val) => {
            stop();
            resolve(val);
        });
    };
}

function init() {
    Vue.use(VueResource);
    Vue.http.interceptors.push(function (request, next) {
        start();

        // continue to next interceptor
        next(function (response) {
            stop();
        });
    });
}
init();

export default { start, stop, decorate, decorate_resolve };