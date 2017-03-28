import Vue from 'vue';
import VueIntl from 'vue-intl';

function init() {
    Vue.use(VueIntl);

    Vue.registerMessages('ru', {
        home_greeting: "Приветствуем в Password Keeper",
        about_greeting: "Приветствую, мир!",
        config_greeting: "Конфигурация",
        config_description: "Здесь вы можете настроить работу приложения"
    });
    Vue.registerMessages('en', {
        home_greeting: "Welcome to Password Keeper",
        about_greeting: "Hello, world!",
        config_greeting: "Configuration page",
        config_description: "Here you can set up configuration parameters"
    });
    set_locale('en');
}
init();

function set_locale(new_locale) {
    Vue.setLocale(new_locale);
}

export default { set_locale };