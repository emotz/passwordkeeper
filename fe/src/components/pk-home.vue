<template>
    <div class="pk-home"
         :id="`pk-home-${_uid}`">
        <div class="jumbotron">
            <h1 v-html="$formatMessage({id: 'home_greeting'})"></h1>
            <p>
                <span v-if="num_of_entries === 0">{{ $formatMessage({id: 'home_description_nopasswords'}) }}</span>
                <span v-else-if="num_of_entries < 5">{{ $formatMessage({id: 'home_description_fewpasswords'}) }}</span>
                <span v-else-if="num_of_entries < 10">{{ $formatMessage({id: 'home_description_manypasswords'}) }}</span>
                <span v-else>{{ $formatMessage({id: 'home_description_toomanypasswords'}) }}</span>
                <pk-async-button class="btn btn-primary pk-btn-refresh-all-pass"
                                 :can-execute="true"
                                 :action="get_entries">
                    <slot>{{ $formatMessage({id: 'home_fetch_all_passwords'}) }}</slot>
                </pk-async-button>
            </p>
        </div>
        <pk-pass-list></pk-pass-list>
    </div>
</template>

<script>
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
}
</script>