import { http } from './http.js';
import * as progressbar from 'src/services/progressbar.js';

http.interceptors.push(function(request, next) {
    progressbar.start();

    // continue to next interceptor
    next(function(response) {
        progressbar.stop();
    });
});
