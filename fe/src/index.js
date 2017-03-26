import 'bootstrap';
import 'bootstrap.css';

import Vue from 'vue';

import './progressbar.js';

import App from 'src/components/app.vue';

const app = new Vue(App).$mount("#app");

$(function () {
    $("#splash").fadeOut(500);
});
