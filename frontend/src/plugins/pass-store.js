import { ClientStore } from 'src/client-store.js';
import * as auth from 'src/services/auth.js';
import * as logger from 'src/services/logger.js';
import * as pass_store from 'src/services/pass-store.js';
import { watch } from 'src/services/watch.js';

const client_store = new ClientStore('pass-store_entries');
const entries = client_store.get();
if (entries !== undefined) {
  for (let entry of entries) {
    pass_store.do_add_entry(entry);
  }
}

watch(pass_store.get_entries, new_entries => {
  client_store.set(new_entries);
});

watch(auth.get_status, (new_status, old_status) => {
  if (new_status === "NEWLY_LOGGED") {
    pass_store.dirty();
    pass_store.push_cmd.execute();
    setTimeout(() => auth.newly_logged(), 0);
  } else if (new_status === 'GUEST') {
    if (old_status !== 'AWAITING_LOGIN') {
      pass_store.reset_entries();
    } else {
      logger.warn(new Error('should not happen, probably something bad is going on'));
    }
  } else if (new_status === 'LOGGED') {
    if (old_status === 'NEWLY_LOGGED') {
      // do nothing
    } else {
      pass_store.reset_entries();
      // not pulling here because we might not need it
      // pulling is initiated at the view level if needed
    }
  } else if (new_status === 'AWAITING_LOGIN') {
    // do nothing
  } else {
    logger.error(new Error('impossibru'));
  }
});
