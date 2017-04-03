import Vue from 'vue';
import App from 'src/components/pk-app.vue';

// import all files from `plugins` directory
const req = require.context('./plugins/', true, /\.js$/);
req.keys().forEach(req);

$(function () {
    const app = new Vue(App).$mount("#app");

    $("#splash").fadeOut(500);
});
