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
            </p>
        </div>
        <pass-list></pass-list>
    </div>
</template>

<script>
import PassList from './pass-list.vue';

export default {
    components: { PassList },
    computed: {
        num_of_entries() {
            return this.$store.state.entries.length;
        }
    }
}
</script>