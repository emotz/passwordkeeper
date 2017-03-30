<template>
    <nav class="app-nav navbar navbar-default"
         :id="`app-nav-${_uid}`">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand"
                   href="/">Password Keeper</a>
            </div>
            <ul class="nav navbar-nav">
                <router-link active-class="active"
                             tag="li"
                             to="/home"><a>{{ $formatMessage({id: 'link_home'}) }}</a></router-link>
                <router-link active-class="active"
                             tag="li"
                             to="/config"><a>{{ $formatMessage({id: 'link_config'}) }}</a></router-link>
                <router-link active-class="active"
                             tag="li"
                             to="/about"><a>{{ $formatMessage({id: 'link_about'}) }}</a></router-link>
            </ul>
        </div>
        <!--/.container-fluid -->
    </nav>
</template>

<script>
export default {
    computed: {
        state_locale() {
            return this.$store.state.locale.locale;
        }
    },
    watch: {
        state_locale() {
            // TODO: very hacky way of dealing with locale change. Probably need to switch to another i18n library
            this.$forceUpdate();
        }
    }
}
</script>