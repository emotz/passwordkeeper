export default {
  home: {
    greeting: "Password Keeper",
    about1: "Check out",
    about2: "page for more info about the project",
    description: {
      nopasswords: "Start filling out fields below to store some passwords",
      fewpasswords: "You are doing great! Keep going! Store some more passwords!",
      manypasswords: "Well you should slow down, you have too many password :(",
      toomanypasswords: "OMG you are passwordniac with so many passwords!"
    },
    fetch_all_passwords: "Fetch all passwords from server"
  },
  passlist: {
    panel_title: "Stored passwords"
  },
  about: {
    greeting: "About Password Keeper",
    description1: "This is a demonstration project for Emotz group - application for storing login/password information. We created it to showcase some common features of the modern websites. The frontend is built using",
    description2: ", a simple yet powerful declarative framework for great UI experience.",
    features: {
      title: "Features",
      visualfeedback: {
        title: "Visual feedback",
        description: "each async interaction is indicated by progress bar at the top."
      },
      lazyloading: {
        title: "Lazy loading",
        description: "each page is loaded on-demand (check the progress bar at the top when you navigate through the website back and forth)."
      },
      latencycompensation: {
        title: "Latency compensation",
        description: "your changes are displayed immediately while being synchronized in the background (check how the website works when you pull your internet cable off)."
      },
      localization: {
        title: "Localization",
        description1: "at the",
        description2: "page you can change the display language and the translation files are loaded on-demand."
      },
      guestfriendly: {
        title: "Guest-friendly",
        description: "you can use this website without authenticating and the data you enter are persisted in your browser's local storage."
      },
      datamigration: {
        title: "Data migration",
        description: "when you realize how awesome this project is and decide to signup, all the passwords you enter while being \"guest\" are automatically migrated to your newly created account."
      },
      cachefriendly: {
        title: "Cache-friendly",
        description: "the resource files have content-hash in their filenames, so browsers cache those resources and invalidate that cache as needed."
      }
    }
  },
  config: {
    greeting: "Configuration page",
    description: "Here you can set up configuration parameters",
    panel_title: "Configration parameters",
    label_language: "Language"
  },
  link: {
    home: "Home",
    config: "Config",
    about: "About"
  },
  notify: {
    itemstored: "Item stored.",
    itemstored_timeout: "Request timed-out when storing item.",
    itemstored_unknown: "Couldn't store item.",
    itemupdated: "Item updated.",
    itemupdated_timeout: "Request timed-out when updating item.",
    itemupdated_unknown: "Couldn't update item.",
    itemremoved: "Item removed.",
    itemremoved_timeout: "Request timed-out when removing item.",
    itemremoved_unknown: "Couldn't remove item.",
    itemsfetched: "Items fetched.",
    itemsfetched_timeout: "Request timed-out when fetching items.",
    itemsfetched_unknown: "Couldn't fetch all items.",
    itemssynced: "Items synced.",
    itemssynced_timeout: "Request timed-out when syncing items.",
    itemssynced_unknown: "Couldn't sync all items."
  },
  confirm_text: "Are you sure?",
  confirm_title: "Confirm",
  label_title: "Title",
  label_username: "Username",
  label_email: "Email Address",
  label_login: "Username or Email Address",
  label_user: "User",
  label_password: "Password",
  button_ok: "Ok",
  button_cancel: "Cancel",
  editor_title: "Edit password entry",
  search_placeholder: "Search",
  no_passwords_found: "No matched passwords.",
  signin: "Sign In",
  signup: "Sign Up",
  signin_title: "Sign In",
  signup_title: "Create your personal account",
  signin_user_placeholder: "Email",
  signin_pass_placeholder: "Password",
  signout: "Sign Out",
  error: {
    Other: {
      BadRequest: "Error with request",
      NotFound: "Resource not found",
      'default': "{message}"
    },
    Auth: {
      WrongPasswordOrUsername: "No user with matching password",
      'default': "Authorization error {message}"
    },
    Validation: {
      'default': "{message}"
    },
    Verification: {
      NotUnique: "{property} already exists"
    }
  }
};
