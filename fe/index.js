import Vue from 'vue';
import dumb from 'bootstrap'; // TODO remove dumb
import VueRouter from 'vue-router';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

Vue.use(VueRouter);

const PassAdder = {
    template: "#pass-adder-template",
    data: function () {
        return {
            title: "",
            user: "",
            password: "",
            show_password: false
        };
    },
    methods: {
        add: function () {
            if (this.title.length > 0 && this.user.length > 0) {
                this.$emit('added', {
                    title: this.title,
                    user: this.user,
                    password: this.password
                });
            }
        }
    }
};

const PassList = {
    template: "#pass-list-template",
    components: { 'pass-adder': PassAdder },
    data: function () {
        return {
            items: [{ title: "hello", user: "user", password: "pass123", show_password: false, stored: "stored" }]
        };
    },
    methods: {
        add: function (item) {
            item.show_password = false;
            item.stored = "notstored";
            this.items.push(item);
            this.storeAsync(item);
        },
        remove: function (index) {
            this.items.splice(index, 1);
        },
        storeAsync: function (item) {
            item.stored = "storing";
            setTimeout(function () {
                if (getRandomArbitrary(0, 100) > 50) {
                    item.stored = "stored";
                } else {
                    item.stored = "notstored";
                }
            }, 3000);
        }
    }
};

const Home = { template: '#home-template', components: { 'pass-list': PassList } };
const About = { template: '#about-template' };

const routes = [
    { path: '', redirect: "/home" },
    { path: '/home', component: Home },
    { path: '/about', component: About }
];

const router = new VueRouter({
    mode: 'history',
    routes // short for routes: routes
});

const app = new Vue({
    el: '#app',
    template: '#app-template',
    data: {
        project_name: "Password Keeper"
    },
    components: {
        'app-nav': {
            template: "#app-nav-template"
        }
    },
    router
});

$(function () {
    $("#splash").fadeOut(500);
});