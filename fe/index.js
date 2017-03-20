import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

import dumb from 'bootstrap'; // TODO remove dumb
import toastr from 'toastr';
import _ from 'lodash';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);

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
        },
        set_entries(state, entries) {
            state.entries = entries;
        }
    },
    actions: {
        add_entry(context, entry) {
            function parse_location(location) {
                // /entries/blablabla
                return location.split('/')[2];
            }

            return new Promise((resolve, reject) => {
                var customActions = {
                    add: { method: 'POST', url: 'entries' }
                };

                let resource = Vue.resource('entries', {}, customActions);

                let entry_to_send = {
                    user: entry.user,
                    title: entry.title,
                    password: entry.password
                };
                resource
                    .add(entry_to_send)
                    .then(response => {
                        let id = parse_location(response.headers.map.Location[0]);
                        entry.id = id;
                        entry_to_send.id = entry.id;
                        context.commit("add_entry", entry_to_send);
                        toastr.success("Item successfully stored.");
                        resolve(entry.id);
                    }, response => {
                        toastr.error(response.status === 408 ? 'Request timed-out when storing item.' : response.body);
                        reject();
                    });
            });
        },
        remove_entry_by_id(context, id) {
            return new Promise((resolve, reject) => {
                let resource = Vue.resource('entries{/id}');

                resource
                    .delete({ id: id })
                    .then(response => {
                        const index = context.state.entries.findIndex(item => item.id === id);
                        if (index >= 0) {
                            context.commit("remove_entry_by_index", index);
                        }

                        toastr.success("Item successfully removed.");
                        resolve();
                    }, response => {
                        const res = response.status === 408 ? 'Request timed-out when removing item.' : response.body;
                        toastr.error(res);
                        reject(res);
                    });
            });
        },
        get_entries(context) {
            let resource = Vue.resource('entries');

            return new Promise((resolve, reject) => {
                resource
                    .get()
                    .then(response => {
                        console.log("response body " + JSON.stringify(response.body));
                        context.commit("set_entries", response.body);
                        toastr.success("Items successfully fetched.");
                        resolve();
                    }, response => {
                        const res = response.status === 408 ? 'Request timed-out when fetching items.' : response.body;
                        toastr.error(res);
                        reject(res);
                    });
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
    store,
    created() {
        this.$store.dispatch('get_entries');
    }
});

$(function () {
    $("#splash").fadeOut(500);
});
