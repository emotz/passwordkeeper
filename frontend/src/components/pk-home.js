
import PkPassList from './pk-pass-list.vue';
import * as pass_store from 'src/services/pass-store.js';
import * as modal from 'src/services/modal.js';

export default {
  components: { PkPassList },
  created() {
    this.pull_cmd = pass_store.pull_cmd;
  },
  computed: {
    num_of_entries() {
      return pass_store.get_entries().length;
    }
  },
  methods: {
    async pull() {
      try {
        await modal.confirm();
      } catch (err) {
        return;
      }
      this.pull_cmd.execute();
    },
    can_pull() {
      return this.pull_cmd.can_execute().canExecute;
    }
  }
};
