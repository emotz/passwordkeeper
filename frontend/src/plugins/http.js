
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

export const http = Vue.http;

// TODO rename it
export function parse_location(response) {
    return response.headers.get('Location').split('/')[3];
}
