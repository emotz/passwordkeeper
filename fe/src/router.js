import Vue from 'vue';
import VueRouter from 'vue-router';
import progressbar from './progressbar.js';

Vue.use(VueRouter);

const routes = [
    { path: '', redirect: "/home" },
    { path: '/home', component: (resolve) => require(['src/components/pk-home.vue'], resolve) },
    { path: '/about', component: (resolve) => require(['src/components/pk-about.vue'], resolve) },
    { path: '/config', component: (resolve) => require(['src/components/pk-config.vue'], resolve) }
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
