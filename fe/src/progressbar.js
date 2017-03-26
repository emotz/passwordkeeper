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