import assert from 'assert';
import { can_execute, Command, execute } from 'command-decorator'; // eslint-disable-line no-unused-vars
import { http, parse_location } from 'src/plugins/http.js';
import * as i18n from 'src/plugins/i18n.js';
import * as auth from 'src/services/auth.js';
import { notifier_error } from 'src/services/loader.js';

// TODO: move it somewhere
const API_ENTRIES_URL = 'api/entries';

export class EntryCommand extends Command {
  /**
  * @param options.entry Must be reactive
  */
  constructor(options) {
    super();

    this.entry = options.entry;
    this.ondelete = options.ondelete;

    assert(this.entry._id);
  }

  dirty() {
    this.entry.synced = false;
  }

  update(newitem) {
    this.entry.synced = false;
    this.entry.title = newitem.title;
    this.entry.user = newitem.user;
    this.entry.password = newitem.password;
  }

  @notifier_error(i18n.terror)
  @execute
  async save() {
    const dto = {
      title: this.entry.title,
      user: this.entry.user,
      password: this.entry.password
    };

    let response;
    if (auth.is_authenticated()) {
      if (this.entry.id !== undefined) {
        response = await http.put(`${API_ENTRIES_URL}/${this.entry.id}`, dto);
      } else {
        response = await http.post(API_ENTRIES_URL, dto);
        this.entry.id = parseInt(parse_location(response));
      }
    }
    this.entry.synced = true;
    return response;
  }

  @can_execute
  can_save() {
    if (!this.entry.synced) {
      return { canExecute: true };
    }
    return {
      canExecute: false,
      reason: "already saved"
    };
  }

  @notifier_error(i18n.terror)
  @execute
  async delete() {
    if (auth.is_authenticated()) {
      if (this.entry.id !== undefined) {
        await http.delete(`${API_ENTRIES_URL}/${this.entry.id}`);
      }
    }
    (this.ondelete || function() { })();
  }

  @can_execute
  can_delete() {
    return { canExecute: true };
  }
}
