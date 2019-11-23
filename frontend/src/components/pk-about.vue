<style scoped>
  .list-entry-title {
    font-weight: bold;
  }
</style>

<template>
  <div
    class="pk-about jumbotron"
    :id="`pk-about-${_uid}`"
  >
    <h1>{{ $t('about.greeting') }}</h1>
    <p>
      {{ $t('about.description1') }} <a href="https://vuejs.org/">Vue</a>{{ $t('about.description2') }}
    </p>
    <p>
      {{ $t('about.features.title') }}:
      <ul>
        <li><span class="list-entry-title">{{ $t('about.features.visualfeedback.title') }}</span> - {{ $t('about.features.visualfeedback.description') }}</li>
        <li><span class="list-entry-title">{{ $t('about.features.lazyloading.title') }}</span> - {{ $t('about.features.lazyloading.description') }}</li>
        <li><span class="list-entry-title">{{ $t('about.features.latencycompensation.title') }}</span> - {{ $t('about.features.latencycompensation.description') }}</li>
        <li><span class="list-entry-title">{{ $t('about.features.localization.title') }}</span> - {{ $t('about.features.localization.description1') }} <router-link
            active-class="active"
            tag="a"
            to="/config"
          >{{ $t('link.config') }}</router-link> {{ $t('about.features.localization.description2') }}
        </li>
        <li><span class="list-entry-title">{{ $t('about.features.guestfriendly.title') }}</span> - {{ $t('about.features.guestfriendly.description') }}</li>
        <li><span class="list-entry-title">{{ $t('about.features.datamigration.title') }}</span> - {{ $t('about.features.datamigration.description') }}</li>
        <li><span class="list-entry-title">{{ $t('about.features.cachefriendly.title') }}</span> - {{ $t('about.features.cachefriendly.description') }}</li>
      </ul>
    </p>
  </div>
</template>
