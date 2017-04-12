import Vue from 'vue';
import VueResource from 'vue-resource';
import * as progressbar from 'src/services/progressbar.js';

Vue.use(VueResource);
Vue.http.interceptors.push(function (request, next) {
    progressbar.start();

    // continue to next interceptor
    next(function (response) {
        progressbar.stop();
    });
});
