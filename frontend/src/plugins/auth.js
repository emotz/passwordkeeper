import { ClientStore } from 'src/client-store.js';
import * as i18n from 'src/plugins/i18n.js';
import * as auth from 'src/services/auth.js';
import * as loader from 'src/services/loader.js';
import { watch } from 'src/services/watch.js';
import { http } from './http.js';

http.interceptors.push(function(request, next) {
  // TODO: should we pass authorization token for each request? may be only for requests which are required to have authorizatioN?
  if (request.headers['Authorization'] === undefined && auth.is_authenticated()) {
    request.headers.set('Authorization', `Bearer ${auth.get_token()}`);
  }
  next(function(response) {
    if (response.status === 401) {
      auth.do_logout();
    }
  });
});

const client_store = new ClientStore('authdata');
const authdata = client_store.get();
if (authdata !== undefined) {
  auth.set_authdata(authdata);
}

watch(auth.get_authdata, new_authdata => {
  client_store.set(new_authdata);
});

watch(() => auth.auth_cmd.is_executing(), is_executing => {
  if (is_executing) {
    loader.perform(auth.auth_cmd.promise,
      () => { },
      i18n.terror);
  }
});
