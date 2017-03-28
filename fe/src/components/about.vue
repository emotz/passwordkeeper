<template>
    <div class="about jumbotron"
         :id="`about-${_uid}`">
        <h1 v-html="$formatMessage({id: 'about_greeting'})"></h1>
        <p>This is my super cool application!</p>
    </div>
</template>

<script>
import 'src/i18n.js';

export default {}
</script>