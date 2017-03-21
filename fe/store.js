import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

import toastr from 'toastr';

Vue.use(Vuex);
Vue.use(VueResource);

export default new Vuex.Store({
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
})