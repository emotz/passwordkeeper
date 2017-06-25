import assert from 'assert';
import { Command, execute } from 'command-decorator';
import { make_reactive } from './watch.js';
import { http, parse_location } from 'src/plugins/http.js';
import * as utls from 'src/utility.js';
import * as i18n from 'src/plugins/i18n.js';

const API_ENTRIES_URL = 'api/entries';

// can't put `entryCmds` into `data` because it is complex object and
// `data` must be reactive, and complex objects can't be reactive.
let entry_cmd = [];
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

export const pull_cmd = new (class PullCommand extends Command {
    @execute
    async execute() {
        let entries = (await http.get(API_ENTRIES_URL)).body;
        // TODO: validate response
        // getting rid of deleted entries
        data.entries = data.entries.filter(item => ~entries.findIndex(e => e.id === item.id));
        entry_cmd = entry_cmd.filter(cmd => ~data.entries.findIndex(e => e._id === cmd.entry._id));
        // updating existing entries
        utls.merge_arrays_of_objects(data.entries, entries, "id", () => {
            let { entry, entryCmd } = ctor();
            entry.synced = true;
            entry_cmd.push(entryCmd);
            return entry;
        });
    }
})();
// {
//     success_msg: i18n.t('notify.itemsfetched'),
//         error_msg: (response) => {
//             return response.status === 408 ?
//                 i18n.t('notify.itemsfetched_timeout') :
//                 (`api_error[${i18n.t(response.body)}]` || i18n.t('notify.itemsfetched_unknown'));
//         }
// });

// TODO: add interaction with server for all actions/commands
export function add_entry(dto) {
    assert(data.entries.find(e => e._id === dto._id) === undefined);
    assert(entry_cmd.find(c => c.entry._id === dto._id) === undefined);

    let { entry, entryCmd } = ctor(dto);
    entry_cmd.push(entryCmd);
    data.entries.push(entry);
    entryCmd.save();
    return entry;
}

/**
 * WARNING Not reactive
 */
export function get_entry_cmd(_id) {
    let entryCmd = get_entryCmd(_id);
    return entryCmd.cmds;
}

export function get_entry_cmdhistory(_id, idx = 0) {
    return entry_cmd[entry_cmd.length - 1 - idx].history;
}

function ctor(obj) {
    const entry = ctor_entry(obj);
    /** @type {EntryCmd} */
    const entryCmd = {
        _id: entry._id,
        cmds: ctor_cmds(entry._id),
        history: []
    };

    return { entryCmd, entry };
}

/**
 *
 * @returns {Entry}
 */
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

function ctor_cmds(_id) {
    let save_cmd = new BasicCommand(async (entry_to_send) => {
        assert(entry_cmd.find(a => a._id === _id) !== undefined);
        assert(data.entries.find(e => e._id === _id) !== undefined);
        let entryCmd = entry_cmd.find(a => a._id === _id);
        let history_entry = {
            status: 'inprogress'
        };
        entryCmd.history.push(history_entry);
        let entry = data.entries.find(e => e._id === _id);

        if (entry_to_send === undefined) {
            entry_to_send = {
                user: entry.user,
                title: entry.title,
                password: entry.password
            };
        } else {
            entry.user = entry_to_send.user;
            entry.title = entry_to_send.title;
            entry.password = entry_to_send.password;
        }

        if (entry.id !== undefined) {
            // it means we are doing PUT
            try {
                await http.put(`${API_ENTRIES_URL}/${entry.id}`, entry_to_send);
            } catch (response) {
                history_entry.status = 'failure';

                throw response.status === 408 ?
                    i18n.t('notify.itemupdated_timeout') :
                    (i18n.t(response.body) || i18n.t('notify.itemupdated_unknown'));
            }
            entry.synced = true;
            history_entry.status = 'success';

            return i18n.t('notify.itemupdated');
        } else {
            // it means we are doing POST
            let response;
            try {
                response = await http.post(API_ENTRIES_URL, entry_to_send);
            } catch (response) {
                history_entry.status = 'failure';

                throw response.status === 408 ?
                    i18n.t('notify.itemstored_timeout') :
                    (i18n.t(response.body) || i18n.t('notify.itemstored_unknown'));
            }
            assert(entry.id === undefined);
            let id = parse_location(response);
            // TODO: validate id
            entry.id = id;
            entry.synced = true;
            history_entry.status = 'success';

            return i18n.t('notify.itemstored');
        }
    });
    let remove_cmd = new BasicCommand(async () => {
        assert(entry_cmd.find(a => a._id === _id) !== undefined);
        assert(data.entries.find(e => e._id === _id) !== undefined);

        let entryCmd = entry_cmd.find(a => a._id === _id);
        let history_entry = {
            status: 'inprogress'
        };
        entryCmd.history.push(history_entry);
        let entry = data.entries.find(e => e._id === _id);

        //
        let response;
        try {
            response = await http.delete(`${API_ENTRIES_URL}/${entry.id}`);
        } catch (err) {
            history_entry.status = 'failure';

            throw response.status === 408 ?
                i18n.t('notify.itemremoved_timeout') :
                (i18n.t(response.body) || i18n.t('notify.itemremoved_unknown'));
        }
        entry_cmd.splice(entry_cmd.findIndex(a => a._id === _id), 1);
        data.entries.splice(data.entries.findIndex(a => a._id === _id), 1);
        history_entry.status = 'success';

        return i18n.t('notify.itemremoved');
        //
    });
    let group = new CommandGroup();
    group.add_command(save_cmd);
    group.add_command(remove_cmd);

    return { save_cmd, remove_cmd };
}

function get_entryCmd(_id) {
    let entryCmd = entry_cmd.find(a => a._id === _id);
    assert(entryCmd !== undefined);
    return entryCmd;
}
