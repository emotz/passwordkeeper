<template>
    <div class="config"
         :id="`config-${_uid}`">
        <div class=" jumbotron">
            <h1 v-html="$formatMessage({id: 'config_greeting'})"></h1>
            <p>{{ $formatMessage({id: 'config_description'}) }} </p>
        </div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">{{ $formatMessage({id: 'config_panel_title'}) }}</h3>
            </div>
            <div class="panel-body">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label :for="`config-locale-${_uid}`"
                               class="col-sm-2 control-label">{{ $formatMessage({id: 'config_label_language'}) }}</label>
                        <div class="col-sm-1">
                            <select class="form-control config-locale-input"
                                    :id="`config-locale-${_uid}`"
                                    v-model="locale">
                                <!--TODO: fill in options using available ones-->
                                <option value="en">en</option>
                                <option value="ru">ru</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import i18n from 'src/i18n.js';

export default {
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