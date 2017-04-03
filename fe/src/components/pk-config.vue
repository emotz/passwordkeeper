<template>
    <div class="pk-config"
         :id="`pk-config-${_uid}`">
        <div class=" jumbotron">
            <h1 v-html="$t('config.greeting')"></h1>
            <p>{{ $t('config.description') }} </p>
        </div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">{{ $t('config.panel_title') }}</h3>
            </div>
            <div class="panel-body">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label :for="`pk-config-locale-${_uid}`"
                               class="col-sm-2 control-label">{{ $t('config.label_language') }}</label>
                        <div class="col-sm-1">
                            <select class="form-control pk-config-locale-input"
                                    :id="`pk-config-locale-${_uid}`"
                                    v-model="locale">
                                <option v-for="lang in locales"
                                        :value="lang">{{ lang }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as i18n from 'src/plugins/i18n.js';

export default {
    data() {
        return {
            locales: i18n.get_locales()
        }
    },
    computed: {
        locale: {
            get() {
                return this.$store.state.locale.locale;
            },
            set(new_locale) {
                this.$store.commit("locale/set_locale", new_locale);
            }
        }
    },
}
</script>