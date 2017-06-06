import * as i18n from 'src/plugins/i18n.js';

import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

export const http = Vue.http;

export function msg_for_error_response(response) {
    if (response.body.reason) return i18n.t(`api_error["${response.body.reason}"]`);
    return response.status + ' ' + response.statusText;
}

export function parse_location(response) {
    return response.headers.map.Location[0].split('/')[2];
}
