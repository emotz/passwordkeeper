
import PkPassList from './pk-pass-list.vue';
import PkAsyncButton from './pk-async-button.vue';
import * as utls from 'src/utility.js';

export default {
    components: { PkPassList, PkAsyncButton },
    data: function () {
        return {
            get_entries: utls.make_fn_singleton(function () {
                return this.$store.dispatch('get_entries');
            })
        };
    },
    computed: {
        num_of_entries() {
            return this.$store.state.entries.length;
        }
    }
};
