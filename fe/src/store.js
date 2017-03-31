import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

import loader from './loader.js';
import i18n from './i18n.js';

Vue.use(Vuex);
Vue.use(VueResource);

const locale = {
    namespaced: true,
    state: {
        locale: ""
    },
    mutations: {
        set_locale(state, new_locale) {
            state.locale = new_locale;
            i18n.set_locale(new_locale);
        }
    }
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',
    modules: {
        locale
    },
    state: {
        entries: []
    },
    mutations: {
        add_entry(state, entry) {
            state.entries.push(entry);
        },
        update_entry(state, entry) {
            let i = state.entries.findIndex(e => e.id === entry.id);
            state.entries.splice(i, 1, entry);
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

            var customActions = {
                add: { method: 'POST', url: 'entries' }
            };

            let resource = Vue.resource('entries', {}, customActions);

            let entry_to_send = {
                user: entry.user,
                title: entry.title,
                password: entry.password
            };
            return loader.perform(
                resource
                    .add(entry_to_send)
                    .then(response => {
                        console.log("Success");
                        let id = parse_location(response.headers.map.Location[0]);
                        entry.id = id;
                        entry_to_send.id = entry.id;
                        context.commit("add_entry", entry_to_send);
                        return entry.id;
                    }, response => {
                        console.log("Failure");
                        // TODO: translate response.body ???
                        const res = response.status === 408 ?
                            i18n.formatMessage({ id: "notify_itemstored_timeout" }) :
                            (response.body || i18n.formatMessage({ id: "notify_itemstored_unknown" }));
                        throw res;
                    }),
                () => i18n.formatMessage({ id: "notify_itemstored" }));
        },
        update_entry(context, entry) {
            let resource = Vue.resource('entries{/id}');

            let entry_to_send = {
                id: entry.id,
                user: entry.user,
                title: entry.title,
                password: entry.password
            };
            return loader.perform(
                resource
                    .update({ id: entry_to_send.id }, entry_to_send)
                    .then(response => {
                        context.commit("update_entry", entry_to_send);
                        return entry;
                    }, response => {
                        // TODO: translate response.body ???
                        throw response.status === 408 ?
                            i18n.formatMessage({ id: "notify_itemupdated_timeout" }) :
                            (response.body || i18n.formatMessage({ id: "notify_itemupdated_unknown" }));
                    }),
                () => i18n.formatMessage({ id: "notify_itemupdated" }));
        },
        remove_entry_by_id(context, id) {
            let resource = Vue.resource('entries{/id}');

            return loader.perform(
                resource
                    .delete({ id: id })
                    .then(response => {
                        const index = context.state.entries.findIndex(item => item.id === id);
                        if (index >= 0) {
                            context.commit("remove_entry_by_index", index);
                        }
                        return;
                    }, response => {
                        // TODO: translate response.body ???
                        throw response.status === 408 ?
                            i18n.formatMessage({ id: "notify_itemremoved_timeout" }) :
                            (response.body || i18n.formatMessage({ id: "notify_itemremoved_unknown" }));
                    }),
                () => i18n.formatMessage({ id: "notify_itemremoved" }));
        },
        get_entries(context) {
            let resource = Vue.resource('entries');

            return loader.perform(
                resource
                    .get()
                    .then(response => {
                        context.commit("set_entries", response.body);
                    }, response => {
                        // TODO: translate response.body ???
                        throw response.status === 408 ?
                            i18n.formatMessage({ id: "notify_itemsfetched_timeout" }) :
                            (response.body || i18n.formatMessage({ id: "notify_itemsfetched_unknown" }));
                    }),
                () => i18n.formatMessage({ id: "notify_itemsfetched" }));
        }
    }
});