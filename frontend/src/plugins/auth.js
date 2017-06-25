import * as auth from 'src/services/auth.js';
import { http, msg_for_error_response } from './http.js';
import ClientStore from 'src/client-store.js';
import { watch } from 'src/services/watch.js';
import * as loader from 'src/services/loader.js';

http.interceptors.push(function(request, next) {
    // TODO: should we pass authorization token for each request? may be only for requests which are required to have authorizatioN?
    if (request.headers['Authorization'] === undefined && auth.is_authenticated()) {
        request.headers.set('Authorization', `Bearer ${auth.get_token()}`);
    }
    next();
    // TODO: should have interceptor for Unauthorized response whatever to remove auth token
});

let client_store = new ClientStore('token');
let token = client_store.get();
if (token !== undefined) {
    auth.set_token(token);
}

watch(auth.get_token, (new_token, old_token) => {
    client_store.set(new_token);
});

auth.login_cmd.on_executing((is_executing, promise) => {
    eoksni $ work - Yesterday at 5:26 PM
    Тоха, тебе чем больше нравится заниматься - яваскриптить или хтмлить/ верстать ?
        Zet - Yesterday at 5:27 PM
    я уверен где- то есть подвох в этом вопросе...(edited)
eoksni $ work - Yesterday at 5:33 PM
яваскрипт у тебя идет довольно туго, с хтмлем ты сможешь быстрее разобраться на приличном уровне
возможно, тебе стоит специализироваться именно на верстке(edited)   if (is_executing) {
    loader.perform(promise,
        () => { },
        msg_for_error_response);
}
});
