import Vue from 'vue';
import VueIntl from 'vue-intl';

function init() {
    Vue.use(VueIntl);

    Vue.registerMessages('ru', {
        home_greeting: "Приветствуем в Password Keeper",
        home_description_nopasswords: "Заполните поля ниже чтобы сохранить пароли",
        home_description_fewpasswords: "Прекрасная работа! Продолжайте в том же духе!",
        home_description_manypasswords: "Помедленнее, паролей слишком много :(",
        home_description_toomanypasswords: "О БОЖЕ да вы просто пароле-маньяк! Слишком много паролей!",
        home_fetch_all_passwords: "Получить пароли с сервера",
        passlist_panel_title: "Сохраненные пароли",
        about_greeting: "Приветствую, мир!",
        about_description: "Приложение для хранения логинов/паролей",
        config_greeting: "Конфигурация",
        config_description: "Здесь вы можете настроить работу приложения",
        config_panel_title: "Настройки",
        config_label_language: "Язык",
        link_home: "Главная",
        link_config: "Настройки",
        link_about: "О сайте",
        label_title: "Название",
        label_user: "Имя пользователя",
        label_password: "Пароль",
        notify_itemstored: "Запись сохранена.",
        notify_itemstored_timeout: "Время запроса истекло при попытке сохранить запись.",
        notify_itemstored_unknown: "Запись не была сохранена.",
        notify_itemupdated: "Запись обновлена.",
        notify_itemupdated_timeout: "Время запроса истекло при попытке обновить запись.",
        notify_itemupdated_unknown: "Запись не была обновлена",
        notify_itemremoved: "Запись удалена.",
        notify_itemremoved_timeout: "Время запроса истекло при попытке удалить запись.",
        notify_itemremoved_unknown: "Запись не была удалена.",
        notify_itemsfetched: "Записи получены.",
        notify_itemsfetched_timeout: "Время запроса истекло при попытке получить записи.",
        notify_itemsfetched_unknown: "Записи не были получены.",
    });
    Vue.registerMessages('en', {
        home_greeting: "Welcome to Password Keeper",
        home_description_nopasswords: "Start filling out fields below to store some passwords",
        home_description_fewpasswords: "You are doing great! Keep going! Store some more passwords!",
        home_description_manypasswords: "Well you should slow down, you have too many password :(",
        home_description_toomanypasswords: "OMG you are passwordniac with so many passwords!",
        home_fetch_all_passwords: "Fetch all passwords from server",
        passlist_panel_title: "Stored passwords",
        about_greeting: "Hello, world!",
        about_description: "App for storing login/passwords",
        config_greeting: "Configuration page",
        config_description: "Here you can set up configuration parameters",
        config_panel_title: "Configration parameters",
        config_label_language: "Language",
        link_home: "Home",
        link_config: "Config",
        link_about: "About",
        label_title: "Title",
        label_user: "User",
        label_password: "Password",
        notify_itemstored: "Item stored.",
        notify_itemstored_timeout: "Request timed-out when storing item.",
        notify_itemstored_unknown: "Couldn't store item.",
        notify_itemupdated: "Item updated.",
        notify_itemupdated_timeout: "Request timed-out when updating item.",
        notify_itemupdated_unknown: "Couldn't update item.",
        notify_itemremoved: "Item removed.",
        notify_itemremoved_timeout: "Request timed-out when removing item.",
        notify_itemremoved_unknown: "Couldn't remove item.",
        notify_itemsfetched: "Items fetched.",
        notify_itemsfetched_timeout: "Request timed-out when fetching items.",
        notify_itemsfetched_unknown: "Couldn't fetch all items.",

    });
    set_locale('en');
}
init();

function set_locale(new_locale) {
    Vue.setLocale(new_locale);
}

function formatMessage(...args) {
    // TODO: another hack. I truly think I should switch to another translation i18n library
    return Vue.prototype.$formatMessage(...args);
}

export default { set_locale, formatMessage };