<template>
    <div class="pk-about jumbotron"
         :id="`pk-about-${_uid}`">
        <h1>{{ $t('about.greeting') }}</h1>
        <p>{{ $t('about.description') }}</p>
    </div>
</template>
