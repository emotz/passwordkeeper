import assert from 'assert';
import { can_execute, Command, execute } from 'command-decorator'; // eslint-disable-line no-unused-vars
import { Counter } from 'src/counter';
import { EntryCommand } from 'src/entry-command.js';
// TODO: remove "circular" dependency - it would be better if control flow goes from plugins to services, not vice versa
import { http } from 'src/plugins/http.js';
import * as i18n from 'src/plugins/i18n.js';
import * as auth from 'src/services/auth.js';
import { notifier } from 'src/services/loader.js';
import * as logger from 'src/services/logger.js';
import * as utls from 'src/utility.js';
import { make_reactive, watch } from './watch.js';

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

export const { enable_login_update, disable_login_update } = (function() {
  const counter = new Counter({
    onEnable() {
      return watch(auth.get_status, (new_status, old_status) => {
        if (new_status === 'NEWLY_LOGGED') {
          // do nothing
        } else if (new_status === 'LOGGED') {
          if (old_status === 'NEWLY_LOGGED') {
            // do nothing
          } else {
            pull_cmd.execute();
          }
        } else if (new_status === 'GUEST') {
          // do nothing
        } else if (new_status === 'AWAITING_LOGIN') {
          // do nothing
        } else {
          logger.error(new Error('impossibru'));
        }
      }, { immediate: true });
    }
  });

  return {
    enable_login_update: counter.enable,
    disable_login_update: counter.disable
  };
})();

export function dirty() {
  for (let entry_cmd of entry_cmds) {
    entry_cmd.dirty();
  }
}

export function reset_entries() {
  entry_cmds = [];
  data.entries = [];
}

export function get_entry_cmd(_id) {
  let entry_cmd = entry_cmds.find(a => a.entry._id === _id);
  assert(entry_cmd !== undefined);
  return entry_cmd;
}

export const push_cmd = new (class PushCommand extends Command {
  @notifier(i18n.t('notify.itemssynced'))
  @execute
  async execute() {
    return Promise.all(entry_cmds.map(entry_cmd => {
      return entry_cmd.save();
    }));
  }

  @can_execute
  can_execute() {
    if (auth.is_authenticated()) {
      return {
        canExecute: true
      };
    } else {
      return {
        canExecute: false,
        reason: "not authenticated"
      };
    }
  }
});

export const pull_cmd = new (class PullCommand extends Command {
  @notifier(i18n.t('notify.itemsfetched'), i18n.terror)
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

  @can_execute
  can_execute() {
    if (auth.is_authenticated()) {
      return {
        canExecute: true
      };
    } else {
      return {
        canExecute: false,
        reason: "not authenticated"
      };
    }
  }
})();

// TODO: add interaction with server for all actions/commands
export function add_entry(dto) {
  assert(data.entries.find(e => e._id === dto._id) === undefined);
  assert(entry_cmds.find(c => c.entry._id === dto._id) === undefined);

  const entry = ctor_entry(dto);
  const entry_cmd = do_add_entry(entry);
  entry_cmd.save();
  return entry;
}

export function do_add_entry(entry) {
  const entry_cmd = ctor_entry_cmd(entry);
  entry_cmds.push(entry_cmd);
  data.entries.push(entry);
  return entry_cmd;
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
