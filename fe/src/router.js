import Vue from 'vue';
import VueRouter from 'vue-router';
import loader from './loader.js';

Vue.use(VueRouter);

const routes = [
    { path: '', redirect: "/home" },
    {
        path: '/home', component: loader.decorate_without_success_notify(
            () => new Promise((resolve, reject) => {
                require(['src/components/pk-home.vue'], resolve, reject);
            }))
    },
    {
        path: '/about', component: loader.decorate_without_success_notify(
            () => new Promise((resolve, reject) => {
                require(['src/components/pk-about.vue'], resolve, reject);
            }))
    },
    {
        path: '/config', component: loader.decorate_without_success_notify(
            () => new Promise((resolve, reject) => {
                require(['src/components/pk-config.vue'], resolve, reject);
            }))
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
