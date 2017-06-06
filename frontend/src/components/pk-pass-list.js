import PkPassAdder from './pk-pass-adder.vue';
import PkPassEditor from './pk-pass-editor.vue';
import PkPassFilter from './pk-pass-filter.vue';

import * as pass_store from 'src/services/pass-store.js';
import * as utls from 'src/utility.js';

/**
 * @typedef {Object} Entry
 * @property {string} _id Local id
 * @property {string} id Persistent id (stored at server in db)
 * @property {string} title
 * @property {string} user
 * @property {string} password
 * @property {boolean} synced True if synced with the server db
 * @property {boolean} show_password
 */

export default {
    components: {
        PkPassAdder,
        PkPassEditor,
        PkPassFilter
    },
    data: function() {
        const items = pass_store.get_entries().map(ctor_entry);
        return {
            items: items,
            editing_item: undefined,
            filter_query: ""
        };
    },
    created() {
        if (this.items.length <= 0) {
            pass_store.pull_cmd.execute();
        }
        this.$watch(pass_store.get_entries, (new_entries) => {
            // FIX: performance issue - too many operations for even slightest change
            this.items = this.items.filter(item => ~new_entries.findIndex(e => e._id === item._id));
            utls.merge_arrays_of_objects(this.items, new_entries, "_id", ctor_entry);
        }, { deep: true });
    },
    computed: {
        show_filter() {
            return this.items.length > 0;
        },
        show_passlist() {
            return this.filtered_items.length > 0;
        },
        filtered_items() {
            return this.items.filter((item) => item.title.toLowerCase().indexOf(this.filter_query.toLowerCase()) >= 0);
        }
    },
    methods: {
        get_last_op(item) {
            return pass_store.get_entry_cmdhistory(item._id, 0);
        },
        get_last_last_op(item) {
            return pass_store.get_entry_cmdhistory(item._id, 1);
        },
        requires_attention(item) {
            let last_op = this.get_last_op(item);
            return (item.synced === false && !this.is_saving(item)) || last_op.status === 'failure' || (last_op.status === 'inprogress' && this.get_last_last_op(item).status === 'failure');
        },
        cancel_edit() {
            this.editing_item = undefined;
        },
        can_edit(item) {
            return this.editing_item === undefined && get_save_cmd(item).can_execute();
        },
        can_remove(item) {
            return get_remove_cmd(item).can_execute();
        },
        is_removing(item) {
            return get_remove_cmd(item).is_executing();
        },
        can_save(item) {
            return item.synced === false && get_save_cmd(item).can_execute();
        },
        is_saving(item) {
            return get_save_cmd(item).is_executing();
        },
        add(item) {
            pass_store.add_entry({
                title: item.title,
                user: item.user,
                password: item.password
            });
        },
        apply_edit(item) {
            get_save_cmd(this.editing_item).execute(item);
            this.editing_item = undefined;
        },
        save(item) {
            get_save_cmd(item).execute();
        },
        remove(item) {
            get_remove_cmd(item).execute();
        }
    }
};

/**
 * 
 * @returns {Entry}
 */
function ctor_entry(obj = {}) {
    return {
        _id: obj._id,
        id: obj.id,
        title: obj.title,
        user: obj.user,
        password: obj.password,
        synced: obj.synced,
        show_password: obj.show_password || false
    };
}

function get_save_cmd(item) {
    return pass_store.get_entry_cmds(item._id).save_cmd;
}

function get_remove_cmd(item) {
    return pass_store.get_entry_cmds(item._id).remove_cmd;
}
