import Vue from 'vue';
import VueResource from 'vue-resource';
import NProgress from 'nprogress';
import 'nprogress.css';
import './progressbar.css';

let counter = 0;

/**
 * Use {@link Loader} instead of this.
 */
function start() {
    if (counter++ === 0) {
        NProgress.start();
    }
}

/**
 * Use {@link Loader} instead of this.
 */
function stop() {
    if (--counter === 0) {
        NProgress.done();
    }
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

export default { start, stop };