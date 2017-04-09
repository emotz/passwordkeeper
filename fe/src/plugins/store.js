import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

//HACK: I dont like to have notifications and translations here, but I dont see a way to watch over action execution in app.vue
import * as i18n from './i18n.js';
import * as loader from 'src/services/loader.js';

Vue.use(Vuex);
Vue.use(VueResource);

const API_ENTRIES_URL = '/api/entries';
const locale = {
    namespaced: true,
    state: {
        locale: ""
    },
    mutations: {
        set_locale(state, new_locale) {
            state.locale = new_locale;
        }
    }
};

const auth = {
    namespaced: true,
    state: {
        authenticated: false
    },
    mutations: {
        set_authenticated(state, new_auth) {
            state.authenticated = new_auth;
        }
    }
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',
    modules: {
        locale,
        auth
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
                add: { method: 'POST' }
            };

            let resource = Vue.resource(API_ENTRIES_URL, {}, customActions);

            let entry_to_send = {
                user: entry.user,
                title: entry.title,
                password: entry.password
            };
            return loader.perform(
                resource
                    .add(entry_to_send)
                    .then(response => {
                        let id = parse_location(response.headers.map.Location[0]);
                        entry.id = id;
                        entry_to_send.id = entry.id;
                        context.commit("add_entry", entry_to_send);
                        return entry.id;
                    }, response => {
                        const res = response.status === 408 ?
                            i18n.t('notify.itemstored_timeout') :
                            (i18n.t(response.body) || i18n.t('notify.itemstored_unknown'));
                        throw res;
                    }),
                () => i18n.t('notify.itemstored'));
        },
        update_entry(context, entry) {
            let resource = Vue.resource(API_ENTRIES_URL + '{/id}');

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
                        throw response.status === 408 ?
                            i18n.t('notify.itemupdated_timeout') :
                            (i18n.t(response.body) || i18n.t('notify.itemupdated_unknown'));
                    }),
                () => i18n.t('notify.itemupdated'));
        },
        remove_entry_by_id(context, id) {
            let resource = Vue.resource(API_ENTRIES_URL + '{/id}');

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
                        throw response.status === 408 ?
                            i18n.t('notify.itemremoved_timeout') :
                            (i18n.t(response.body) || i18n.t('notify.itemremoved_unknown'));
                    }),
                () => i18n.t('notify.itemremoved'));
        },
        get_entries(context) {
            let resource = Vue.resource(API_ENTRIES_URL);

            return loader.perform(
                resource
                    .get()
                    .then(response => {
                        context.commit("set_entries", response.body);
                    }, response => {
                        throw response.status === 408 ?
                            i18n.t('notify.itemsfetched_timeout') :
                            (i18n.t(response.body) || i18n.t('notify.itemsfetched_unknown'));
                    }),
                () => i18n.t('notify.itemsfetched'));
        }
    }
});