import 'font-awesome-webpack';
import 'bootstrap';
import 'bootstrap.css';

import Vue from 'vue';

import './progressbar.js';
import './i18n.js';

import App from 'src/components/pk-app.vue';

const app = new Vue(App).$mount("#app");

$(function () {
    $("#splash").fadeOut(500);
});
