<template>
    <div class="pk-about jumbotron"
         :id="`pk-about-${_uid}`">
        <h1>{{ $formatMessage({id: 'about_greeting'}) }}</h1>
        <p>{{ $formatMessage({id: 'about_description'}) }}</p>
    </div>
</template>

<script>
import 'src/i18n.js';

export default {}
</script>