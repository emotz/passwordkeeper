import * as auth from 'src/services/auth.js';
import { http } from './http.js';
import ClientStore from 'src/client-store.js';
import { watch } from 'src/services/watch.js';
import * as loader from 'src/services/loader.js';
import * as i18n from 'src/plugins/i18n.js';

http.interceptors.push(function(request, next) {
    // TODO: should we pass authorization token for each request? may be only for requests which are required to have authorizatioN?
    if (request.headers['Authorization'] === undefined && auth.is_authenticated()) {
        request.headers.set('Authorization', `Bearer ${auth.get_token()}`);
    }
    next(function(response) {
        if (response.status === 401) {
            auth.logout();
        }
    });
});

let client_store = new ClientStore('token');
let token = client_store.get();
if (token !== undefined) {
    auth.set_token(token);
}

watch(auth.get_token, (new_token, old_token) => {
    client_store.set(new_token);
});

watch(() => auth.auth_cmd.is_executing(), (is_executing) => {
    if (is_executing) {
        loader.perform(auth.auth_cmd.promise,
            () => { },
            i18n.terror);
    }
});
