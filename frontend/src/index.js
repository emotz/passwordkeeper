import Vue from 'vue';
import App from 'src/components/pk-app.vue';

// import all files from `plugins` directory
const req = require.context('./plugins/', true, /\.js$/);
// HACK: vue-resource does not provide chaining of error handlers,
//  so we must include error plugin last so that other
//  http response handlers are finished correctly
req.keys().filter(key => key !== './error.js').forEach(req);
req('./error.js');

$(function() {
    new Vue(App).$mount("#app");

    $("#splash").fadeOut(500);

    if (process.env.NODE_ENV === 'development') {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://localhost:35729/livereload.js";
        document.body.appendChild(script);
    }
});
