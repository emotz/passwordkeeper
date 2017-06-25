import assert from 'assert';
import { Command, execute, can_execute } from 'command-decorator';
import { http, parse_location } from 'src/plugins/http.js';

// TODO: move it somewhere
const API_ENTRIES_URL = 'api/entries';

export class EntryCommand extends Command {
    constructor(entry) {
        super();

        // Reactive
        this.entry = entry;

        assert(this.entry._id);
    }

    @execute
    async save() {
        assert(this.entry.synced === false);

        if (this.entry.id !== undefined) {
            const response = await http.put(`${API_ENTRIES_URL}/${this.entry.id}`, this.entry);
            this.entry.synced = true;
            return response;
        } else {
            const response = await http.post(API_ENTRIES_URL, this.entry);
            this.entry.id = parse_location(response);
            this.entry.synced = true;
            return response;
        }
    }

    // Not Reactive because of @can_execute
    @can_execute
    can_save() {
        if (this.entry.synced === false) {
            return { canExecute: true };
        }
        return {
            canExecute: false,
            reason: "already synced"
        };
    }

    @execute
    async delete() {
        if (this.entry.id !== undefined) {
            return await http.delete(`${API_ENTRIES_URL}/${this.entry.id}`);
        }
    }

    // Not Reactive because of @can_execute
    @can_execute
    can_delete() {
        return { canExecute: true };
    }
}
