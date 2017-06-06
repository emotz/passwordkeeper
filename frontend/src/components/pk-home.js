
import PkPassList from './pk-pass-list.vue';
import * as pass_store from 'src/services/pass-store.js';

export default {
    components: { PkPassList },
    created() {
        this.pull_cmd = pass_store.pull_cmd;
    },
    computed: {
        num_of_entries() {
            return pass_store.get_entries().length;
        }
    }
};
