<template>
    <transition name="fade"
                appear>
        <div class="wrapper">
            <div class="container content">
                <pk-app-nav></pk-app-nav>
                <!--<keep-alive>-->
                <router-view></router-view>
                <!--</keep-alive>-->
            </div>
            <div id="footer">
                © 2017 emotz
            </div>
        </div>
    </transition>
</template>

<script>
import PkAppNav from './pk-app-nav.vue';
import router from 'src/plugins/router.js';
import store from 'src/plugins/store.js';
import * as i18n from 'src/plugins/i18n.js';

export default {
    components: { PkAppNav },
    data: {
        project_name: "Password Keeper"
    },
    router,
    store,
    created() {
        this.$store.commit('locale/set_locale', 'en');
    },
    watch: {
        '$store.state.locale.locale'(new_locale) {
            i18n.set_locale(new_locale);
        }
    }
}
</script>

<style>
.blur {
    color: transparent;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    user-select: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}

.content {
    flex: 1 0 auto;
}

.wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#footer {
    text-align: center;
    line-height: 30px;
    height: 30px;
    background: lightgrey;
}

.force-parent-lh {
    line-height: inherit !important;
}
</style>