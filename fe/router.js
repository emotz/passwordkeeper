import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './home.vue';
import About from './about.vue';

const routes = [
    { path: '', redirect: "/home" },
    { path: '/home', component: Home },
    { path: '/about', component: About }
];

export default new VueRouter({
    mode: 'history',
    routes
});
