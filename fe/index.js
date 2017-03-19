import Vue from 'vue';
import dumb from 'bootstrap'; // TODO remove dumb
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = { template: '<div>home</div>' };
const About = { template: '<div>about</div>' };

const routes = [
    { path: '/home', component: Home },
    { path: '/about', component: About }
];

const router = new VueRouter({
    routes // short for routes: routes
})

const app = new Vue({
    el: '#app',
    template: '#app-template',
    data: {
        project_name: "Password Keeper",
        loaded: false
    },
    router
});
