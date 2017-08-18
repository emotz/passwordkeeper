import assert from 'assert';
import { Command, execute } from 'command-decorator'; // eslint-disable-line no-unused-vars
import { make_reactive } from './watch.js';
import { http } from 'src/plugins/http.js';
import { EntryCommand } from 'src/entry-command.js';
import * as utls from 'src/utility.js';
import * as i18n from 'src/plugins/i18n.js';
import { loader } from 'src/services/loader.js';
import * as notify from 'src/services/notify.js';

const API_ENTRIES_URL = 'api/entries';

// can't put `entry_cmds` into `data` because it is complex object and
// `data` must be reactive, and complex objects can't be reactive.
let entry_cmds = [];
const data = {
    entries: []
};
make_reactive(data);

/**
 * Reactive
 */
export function get_entries() {
    return data.entries;
}

export function get_entry_cmd(_id) {
    let entry_cmd = entry_cmds.find(a => a.entry._id === _id);
    assert(entry_cmd !== undefined);
    return entry_cmd;
}

export const pull_cmd = new (class PullCommand extends Command {
    @loader(i18n.t('notify.itemsfetched'))
    @execute
    async execute() {
        const response = await http.get(API_ENTRIES_URL);
        const entries = response.body;

        // getting rid of deleted entries
        data.entries = data.entries.filter(item => ~entries.findIndex(e => e.id === item.id));
        entry_cmds = entry_cmds.filter(cmd => ~data.entries.findIndex(e => e._id === cmd.entry._id));

        // updating existing entries
        utls.merge_arrays_of_objects(data.entries, entries, "id", () => {
            let entry = ctor_entry();
            entry.synced = true;
            entry_cmds.push(ctor_entry_cmd(entry));
            // TODO refactor_entry - entry_cmd and entry unsynced possibly
            return entry;
        });
    }
})();

// TODO: add interaction with server for all actions/commands
export function add_entry(dto) {
    assert(data.entries.find(e => e._id === dto._id) === undefined);
    assert(entry_cmds.find(c => c.entry._id === dto._id) === undefined);

    let entry = ctor_entry(dto);
    let entry_cmd = ctor_entry_cmd(entry);
    entry_cmds.push(entry_cmd);
    data.entries.push(entry);
    entry_cmd.save();
    return entry;
}

function ctor_entry_cmd(entry) {
    return new EntryCommand({
        entry,
        ondelete: function() {
            // HACK ohhh this is so dirty
            const idx = data.entries.indexOf(entry);
            data.entries.splice(idx, 1);
        }
    });
}

function ctor_entry(obj = {}) {
    return {
        _id: obj._id || utls.generateUniqueId("pass-entry"),
        id: obj.id,
        title: obj.title,
        user: obj.user,
        password: obj.password,
        synced: obj.synced || false
    };
}
