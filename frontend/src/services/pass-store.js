import assert from 'assert';
import BasicCommand from 'src/basic-command.js';
import CommandGroup from 'src/command-group.js';
import { make_reactive } from './watch.js';
import { http, parse_location } from 'src/plugins/http.js';
import * as utls from 'src/utility.js';
import * as i18n from 'src/plugins/i18n.js';

const API_ENTRIES_URL = 'api/entries';

let actions = [];
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

export const pull_cmd = new BasicCommand(async () => {
    let entries = (await http.get(API_ENTRIES_URL)).body;
    // TODO: validate response
    data.entries = data.entries.filter(item => ~entries.findIndex(e => e.id === item.id));
    actions = actions.filter(item => ~data.entries.findIndex(e => e._id === item._id));
    utls.merge_arrays_of_objects(data.entries, entries, "id", () => {
        let { entry, action } = ctor();
        entry.synced = true;
        actions.push(action);
        return entry;
    });
}, {
        success_msg: i18n.t('notify.itemsfetched'),
        error_msg: (response) => {
            return response.status === 408 ?
                i18n.t('notify.itemsfetched_timeout') :
                (`api_error[${i18n.t(response.body)}]` || i18n.t('notify.itemsfetched_unknown'));
        }
    });

// TODO: add interaction with server for all actions/commands
export function add_entry(dto) {
    assert(data.entries.find(e => e._id === dto._id) === undefined);
    assert(actions.find(a => a._id === dto._id) === undefined);

    let { entry, action } = ctor(dto);
    actions.push(action);
    data.entries.push(entry);
    action.cmds.save_cmd.execute();
    return entry;
}

/**
 * WARNING Not reactive
 */
export function get_entry_cmds(_id) {
    let action = get_action(_id);
    return action.cmds;
}

export function get_entry_cmdhistory(_id, idx = 0) {
    return actions[actions.length - 1 - idx].history;
}

function ctor(obj) {
    const entry = ctor_entry(obj);
    /** @type {Action} */
    const action = {
        _id: entry._id,
        cmds: ctor_cmds(entry._id),
        history: []
    };

    return { action, entry };
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
        assert(actions.find(a => a._id === _id) !== undefined);
        assert(data.entries.find(e => e._id === _id) !== undefined);
        let action = actions.find(a => a._id === _id);
        let history_entry = {
            status: 'inprogress'
        };
        action.history.push(history_entry);
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
        assert(actions.find(a => a._id === _id) !== undefined);
        assert(data.entries.find(e => e._id === _id) !== undefined);

        let action = actions.find(a => a._id === _id);
        let history_entry = {
            status: 'inprogress'
        };
        action.history.push(history_entry);
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
        actions.splice(actions.findIndex(a => a._id === _id), 1);
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

function get_action(_id) {
    let action = actions.find(a => a._id === _id);
    assert(action !== undefined);
    return action;
}
