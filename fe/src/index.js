import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

import AppNav from './app-nav.vue';

import router from './router';
import store from './store';

import 'bootstrap';

const app = new Vue({
    el: '#app',
    template: '#app-template',
    components: { AppNav },
    data: {
        project_name: "Password Keeper"
    },
    router,
    store,
    created() {
        this.$store.dispatch('get_entries');
    }
});

$(function () {
    $("#splash").fadeOut(500);
});
