import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import dumb from 'bootstrap'; // TODO remove dumb
import toastr from 'toastr';
import _ from 'lodash';

Vue.use(VueRouter);
Vue.use(Vuex);

/**
 * All properties of all objects from arr2 are merged (extended) to arr1.
 * @param {[Object]} arr1 Array to merge to
 * @param {[Object]} arr2 Array to merge from
 * @param {String} prop Determines uniqueness of objects
 * @param {Function} ctr Function to construct default element to push into arr1 if element from arr2 is not found in arr1
 */
function merge_arrays_of_objects(arr1, arr2, prop, ctr) {
    arr2.forEach(function (element) {
        let item = arr1.find(item => item[prop] === element[prop]);
        if (item === undefined) {
            item = ctr();
            _.extend(item, element);
            arr1.push(item);
        } else {
            _.extend(item, element);
        }
    }, this);
    let ids_to_remove = arr1
        .map(i => i.id)
        .filter(i => i !== undefined)
        .filter(i => arr2.find(j => j.id === i) === undefined);
    ids_to_remove.forEach(i => {
        let index_to_remove = arr1.findIndex(j => j.id === i);
        arr1.splice(index_to_remove, 1);
    });
}

function get_random_arbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const store = new Vuex.Store({
    strict: true, // TODO Only for Debug (process.env.NODE_ENV !== 'production')

    state: {
        entries: []
    },
    mutations: {
        add_entry(state, entry) {
            state.entries.push(entry);
        },
        remove_entry_by_index(state, entryIndex) {
            state.entries.splice(entryIndex, 1);
        }
    },
    actions: {
        add_entry(context, entry) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    if (get_random_arbitrary(0, 100) > 50) {
                        const guid = () => {
                            function s4() {
                                return Math.floor((1 + Math.random()) * 0x10000)
                                    .toString(16)
                                    .substring(1);
                            }
                            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                                s4() + '-' + s4() + s4() + s4();
                        }

                        // TODO I DON'T LIKE THAT WE HAVE TO SET ID HERE BECAUSE OTHERWISE WE GET DUPLICATED ITEMS IN LIST
                        entry.id = guid();
                        context.commit("add_entry", {
                            id: entry.id,
                            user: entry.user,
                            title: entry.title,
                            password: entry.password
                        });
                        toastr.success("Item successfully stored.");
                        resolve(entry.id);
                    } else {
                        toastr.error("Item couldn't be stored.");
                        reject();
                    }
                }, 1500);
            });
        },
        remove_entry_by_id(context, id) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    if (get_random_arbitrary(0, 100) > 50) {
                        const index = context.state.entries.findIndex(item => item.id === id);
                        if (index < 0) {
                            const reason = "Couldn't find item to remove.";
                            toastr.error(reason);
                            reject(reason);
                            return;
                        }
                        context.commit("remove_entry_by_index", index);
                        toastr.success("Item successfully removed.");
                        resolve();
                    } else {
                        toastr.error("Item couldn't be removed.");
                        reject();
                    }
                }, 1500);
            });
        }
    }
});

const PassAdder = {
    template: "#pass-adder-template",
    data: function () {
        return {
            title: "",
            title_error: false,
            user: "",
            user_error: false,
            password: "",
            show_password: false
        };
    },
    methods: {
        add: function () {
            if (this.title.length <= 0) this.title_error = true;
            if (this.user.length <= 0) this.user_error = true;
            if (this.title.length > 0 && this.user.length > 0) {
                this.$emit('added', {
                    title: this.title,
                    user: this.user,
                    password: this.password
                });
            }
        }
    },
    watch: {
        title: function (val) {
            this.title_error = false;
        },
        user: function (val) {
            this.user_error = false;
        }
    }
};

const PassList = {
    template: "#pass-list-template",
    components: { 'pass-adder': PassAdder },
    data: function () {
        const items = this.$store.state.entries.map(function (element) {
            return {
                id: element.id,
                title: element.title,
                user: element.user,
                password: element.password,
                show_password: false,
                stored: "stored"
            };
        }, this);
        return {
            items: items
        };
    },
    computed: {
        state_entries() {
            return this.$store.state.entries;
        }
    },
    watch: {
        state_entries: function (new_entries) {
            merge_arrays_of_objects(this.items, new_entries, "id", () => { return { show_password: false, stored: "stored" }; });
        }
    },
    methods: {
        add: function (item) {
            item.show_password = false;
            item.stored = "notstored";
            this.items.push(item);

            item.stored = "storing";
            this.$store.dispatch('add_entry', item).then((id) => { item.stored = "stored"; }, () => { item.stored = "notstored"; });
        },
        retry_add: function (item) {
            item.stored = "storing";
            this.$store.dispatch('add_entry', item).then((id) => { item.stored = "stored"; }, () => { item.stored = "notstored"; });
        },
        remove: function (index) {
            const item = this.items[index];
            if (item.id === undefined) {
                this.items.splice(index, 1);
                return;
            }
            const oldstored = item.stored;
            item.stored = "removing";
            this.$store.dispatch('remove_entry_by_id', item.id)
                .then(() => { }, () => { item.stored = oldstored; });
        }
    }
};

const Home = {
    template: '#home-template',
    components: { 'pass-list': PassList },
    computed: {
        num_of_entries() {
            return this.$store.state.entries.length;
        }
    }
};
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
    router,
    store
});

$(function () {
    $("#splash").fadeOut(500);
});
