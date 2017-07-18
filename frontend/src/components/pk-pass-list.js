import PkPassAdder from './pk-pass-adder.vue';
import PkPassEditor from './pk-pass-editor.vue';
import PkPassFilter from './pk-pass-filter.vue';

import { Status as CommandStatus } from 'command-decorator';
import * as pass_store from 'src/services/pass-store.js';
import * as utls from 'src/utility.js';

import * as modal from 'src/services/modal.js';

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
            const history = get_entry_cmd(item).history;
            return history[history.length - 1];
        },
        get_last_last_op(item) {
            const history = get_entry_cmd(item).history;
            return history[history.length - 2];
        },
        requires_attention(item) {
            let last_op = this.get_last_op(item);
            if (item.synced === false && !this.is_saving(item)) return true;
            if (last_op) {
                if (last_op.status === CommandStatus.Failed) return true;
                let last_last_op = this.get_last_last_op(item);
                if (last_last_op) {
                    if (last_op.status === CommandStatus.Pending && last_last_op.status === CommandStatus.Failure) return true;
                }
            }
            return false;
        },
        can_edit(item) {
            const last_op = this.get_last_op(item);
            if (last_op && last_op.status === CommandStatus.Pending) {
                return false;
            }
            return true;
        },
        can_remove(item) {
            return get_entry_cmd(item).can_delete().canExecute;
        },
        is_removing(item) {
            let cmd = get_entry_cmd(item);
            let last_op = this.get_last_op(item);
            return cmd.is_executing() && last_op.cmd === 'delete' && last_op.status === CommandStatus.Pending;
        },
        can_save(item) {
            return get_entry_cmd(item).can_save(item).canExecute;
        },
        is_saving(item) {
            let cmd = get_entry_cmd(item);
            let last_op = this.get_last_op(item);
            return cmd.is_executing() && last_op.cmd === 'save' && last_op.status === CommandStatus.Pending;
        },
        add(item) {
            pass_store.add_entry({
                title: item.title,
                user: item.user,
                password: item.password
            });
        },
        async edit(item) {
            const props = {
                item: {
                    user: item.user,
                    title: item.title,
                    password: item.password
                }
            };

            let newitem;
            try {
                newitem = await modal.open(PkPassEditor, props);
            } catch (err) {
                return;
            }
            item.title = newitem.title;
            item.password = newitem.password;
            item.user = newitem.user;
            item.synced = false;
            this.save(item);
        },
        save(item) {
            get_entry_cmd(item).save(item);
        },
        remove(item) {
            get_entry_cmd(item).delete();
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

function get_entry_cmd(item) {
    return pass_store.get_entry_cmd(item._id);
}
