<template>
    <div class="home"
         :id="`home-${_uid}`">
        <div class="jumbotron">
            <h1>Welcome to Password Keeper</h1>
            <p>
                <span v-if="num_of_entries === 0">Start filling out fields below to store some passwords</span>
                <span v-else-if="num_of_entries < 5">You are doing great! Keep going! Store some more passwords!</span>
                <span v-else-if="num_of_entries < 10">Well you should slow down, you have too many password :(</span>
                <span v-else-if="num_of_entries < 15">OMG you are passwordniac with so many passwords!</span>
                <async-button class="btn btn-primary btn-refresh-all-pass"
                              :can-execute="true"
                              :action="get_entries">
                    <slot>Fetch all passwords from server</slot>
                </async-button>
            </p>
        </div>
        <pass-list></pass-list>
    </div>
</template>

<script>
import PassList from './pass-list.vue';
import AsyncButton from './async-button.vue';
import * as utls from './utility.js';

export default {
    components: { PassList, AsyncButton },
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