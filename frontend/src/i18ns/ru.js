export default {
  home: {
    greeting: "Приветствуем в Password Keeper",
    description: {
      nopasswords: "Заполните поля ниже чтобы сохранить пароли",
      fewpasswords: "Прекрасная работа! Продолжайте в том же духе!",
      manypasswords: "Помедленнее, паролей слишком много :(",
      toomanypasswords: "О БОЖЕ да вы просто пароле-маньяк! Слишком много паролей!"
    },
    fetch_all_passwords: "Получить пароли с сервера"
  },
  passlist: {
    panel_title: "Сохраненные пароли"
  },
  about: {
    greeting: "Приветствую, мир!",
    description: "Приложение для хранения логинов/паролей"
  },
  config: {
    greeting: "Конфигурация",
    description: "Здесь вы можете настроить работу приложения",
    panel_title: "Настройки",
    label_language: "Язык"
  },
  link: {
    home: "Главная",
    config: "Настройки",
    about: "О сайте"
  },
  notify: {
    itemstored: "Запись сохранена.",
    itemstored_timeout: "Время запроса истекло при попытке сохранить запись.",
    itemstored_unknown: "Запись не была сохранена.",
    itemupdated: "Запись обновлена.",
    itemupdated_timeout: "Время запроса истекло при попытке обновить запись.",
    itemupdated_unknown: "Запись не была обновлена",
    itemremoved: "Запись удалена.",
    itemremoved_timeout: "Время запроса истекло при попытке удалить запись.",
    itemremoved_unknown: "Запись не была удалена.",
    itemsfetched: "Записи получены.",
    itemsfetched_timeout: "Время запроса истекло при попытке получить записи.",
    itemsfetched_unknown: "Записи не были получены.",
    itemssynced: "Записи синхронизированы.",
    itemssynced_timeout: "Время запроса истекло при попытке синхронизировать записи.",
    itemssynced_unknown: "Записи не были синхронизированы."
  },
  confirm_text: "Вы уверены?",
  confirm_title: "Подтвердить",
  label_username: "Имя пользователя",
  label_email: "Электронная почта",
  label_login: "Имя пользователя или электронная почта",
  label_title: "Название",
  label_user: "Имя пользователя",
  label_password: "Пароль",
  button_ok: "Принять",
  button_cancel: "Отмена",
  editor_title: "Редактирование записи",
  search_placeholder: "Поиск",
  no_passwords_found: "Совпадений не найдено.",
  signin: "Войти",
  signup: "Зарегистрироваться",
  signin_title: "Войти",
  signup_title: "Создать свой персональный аккаунт",
  signin_user_placeholder: "Электронный адрес",
  signin_pass_placeholder: "Пароль",
  signout: "Выйти",
  error: {
    Other: {
      BadRequest: "Ошибка запроса",
      NotFound: "Запрашиваемый ресурс не найден",
      'default': "{message}"
    },
    Auth: {
      WrongPasswordOrUsername: "Ошибка имени пользователя или пароля",
      'default': "Ошибка авторизации {message}"
    },
    Validation: {
      'default': "{message}"
    },
    Verification: {
      NotUnique: "{property} уже существует"
    }
  }
};
