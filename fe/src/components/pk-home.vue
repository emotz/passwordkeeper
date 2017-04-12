<template>
    <div class="pk-home"
         :id="`pk-home-${_uid}`">
        <div class="jumbotron">
            <h1 v-html="$t('home.greeting')"></h1>
            <p>
                <span v-if="num_of_entries === 0">{{ $t('home.description.nopasswords') }}</span>
                <span v-else-if="num_of_entries < 5">{{ $t('home.description.fewpasswords') }}</span>
                <span v-else-if="num_of_entries < 10">{{ $t('home.description.manypasswords') }}</span>
                <span v-else>{{ $t('home.description.toomanypasswords') }}</span>
                <pk-async-button class="btn btn-primary pk-btn-refresh-all-pass"
                                 :can-execute="true"
                                 :action="get_entries">
                    <slot>{{ $t('home.fetch_all_passwords') }}</slot>
                </pk-async-button>
            </p>
        </div>
        <pk-pass-list></pk-pass-list>
    </div>
</template>

<script src="./pk-home.js"></script>