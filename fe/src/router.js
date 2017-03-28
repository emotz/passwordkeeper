import Vue from 'vue';
import VueRouter from 'vue-router';
import progressbar from './progressbar.js';

Vue.use(VueRouter);

import Home from 'src/components/home.vue';
import About from 'src/components/about.vue';
import Config from 'src/components/config.vue';

const routes = [
    { path: '', redirect: "/home" },
    { path: '/home', component: Home },
    { path: '/about', component: About },
    { path: '/config', component: Config }
];

const router = new VueRouter({
    mode: 'history',
    routes
});
router.beforeEach((to, from, next) => {
    progressbar.start();
    next();
});
router.afterEach((to, from) => {
    progressbar.stop();
});

export default router;
