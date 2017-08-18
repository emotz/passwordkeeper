import assert from 'assert';
import { Command, execute } from 'command-decorator'; // eslint-disable-line no-unused-vars
import { make_reactive } from './watch.js';
import { http } from 'src/plugins/http.js';
import { EntryCommand } from 'src/entry-command.js';
import * as utls from 'src/utility.js';
import * as i18n from 'src/plugins/i18n.js';

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
    @execute
    async execute() {
        let response;
        try {
            response = await http.get(API_ENTRIES_URL);
        } catch (err) {
            notify.error(i18n.terror(err));
            throw err;
        }
        notify.success(i18n.t('notify.itemsfetched'));
        // TODO move that notification stuff somewhere

        let entries = response.body;
        // TODO: validate response
        // TODO: handle errors

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

// function ctor_cmds(_id) {
//     let save_cmd = new BasicCommand(async (entry_to_send) => {
//         assert(entry_cmd.find(a => a._id === _id) !== undefined);
//         assert(data.entries.find(e => e._id === _id) !== undefined);
//         let entry_cmd = entry_cmd.find(a => a._id === _id);
//         let history_entry = {
//             status: 'inprogress'
//         };
//         entry_cmd.history.push(history_entry);
//         let entry = data.entries.find(e => e._id === _id);

//         if (entry_to_send === undefined) {
//             entry_to_send = {
//                 user: entry.user,
//                 title: entry.title,
//                 password: entry.password
//             };
//         } else {
//             entry.user = entry_to_send.user;
//             entry.title = entry_to_send.title;
//             entry.password = entry_to_send.password;
//         }

//         if (entry.id !== undefined) {
//             // it means we are doing PUT
//             try {
//                 await http.put(`${API_ENTRIES_URL}/${entry.id}`, entry_to_send);
//             } catch (response) {
//                 history_entry.status = 'failure';

//                 throw response.status === 408 ?
//                     i18n.t('notify.itemupdated_timeout') :
//                     (i18n.t(response.body) || i18n.t('notify.itemupdated_unknown'));
//             }
//             entry.synced = true;
//             history_entry.status = 'success';

//             return i18n.t('notify.itemupdated');
//         } else {
//             // it means we are doing POST
//             let response;
//             try {
//                 response = await http.post(API_ENTRIES_URL, entry_to_send);
//             } catch (response) {
//                 history_entry.status = 'failure';

//                 throw response.status === 408 ?
//                     i18n.t('notify.itemstored_timeout') :
//                     (i18n.t(response.body) || i18n.t('notify.itemstored_unknown'));
//             }
//             assert(entry.id === undefined);
//             let id = parse_location(response);
//             // TODO: validate id
//             entry.id = id;
//             entry.synced = true;
//             history_entry.status = 'success';

//             return i18n.t('notify.itemstored');
//         }
//     });
//     let remove_cmd = new BasicCommand(async () => {
//         assert(entry_cmd.find(a => a._id === _id) !== undefined);
//         assert(data.entries.find(e => e._id === _id) !== undefined);

//         let entry_cmd = entry_cmd.find(a => a._id === _id);
//         let history_entry = {
//             status: 'inprogress'
//         };
//         entry_cmd.history.push(history_entry);
//         let entry = data.entries.find(e => e._id === _id);

//         //
//         let response;
//         try {
//             response = await http.delete(`${API_ENTRIES_URL}/${entry.id}`);
//         } catch (err) {
//             history_entry.status = 'failure';

//             throw response.status === 408 ?
//                 i18n.t('notify.itemremoved_timeout') :
//                 (i18n.t(response.body) || i18n.t('notify.itemremoved_unknown'));
//         }
//         entry_cmd.splice(entry_cmd.findIndex(a => a._id === _id), 1);
//         data.entries.splice(data.entries.findIndex(a => a._id === _id), 1);
//         history_entry.status = 'success';

//         return i18n.t('notify.itemremoved');
//         //
//     });
//     let group = new CommandGroup();
//     group.add_command(save_cmd);
//     group.add_command(remove_cmd);

//     return { save_cmd, remove_cmd };
// }
