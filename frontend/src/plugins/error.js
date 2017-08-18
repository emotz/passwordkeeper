import { http } from './http.js';
import error from 'src/error.js';

http.interceptors.push(function(request, next) {
    next(function(response) {
        if (response.status < 400) return;
        try {
            const err = response.data;
            switch (response.status) {
                case 409:
                    if (err !== undefined) throw err;
                    break;
                case 404:
                    throw {
                        code: error.ErrorCode.Other,
                        type: error.Other.NotFound
                    };
                case 401:
                    if (err !== undefined && err.code) throw err;
                    throw {
                        code: error.ErrorCode.Auth,
                        message: ''
                    };
                case 400:
                    if (err !== undefined) {
                        switch (err.code) {
                            case error.ErrorCode.Validation:
                                throw err;
                        }
                    }
                    break;
            }
            const message = (err === undefined ? undefined : err.message) || '';
            throw {
                code: error.ErrorCode.Other,
                message: `${response.status} ${response.statusText} ${message}`
            };
        } catch (err) {
            err.context = err.context || {};
            err.context.request = request;
            err.context.response = response;
            throw err;
        }
    });
});
