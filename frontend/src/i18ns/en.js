export default {
    home: {
        greeting: "Welcome to Password Keeper",
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
        greeting: "Hello, world!",
        description: "App for storing login/passwords"
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
        itemsfetched_unknown: "Couldn't fetch all items."
    },
    confirm_text: "Are you sure?",
    confirm_title: "Confirm",
    label_title: "Title",
    label_user: "User",
    label_password: "Password",
    button_ok: "Ok",
    button_cancel: "Cancel",
    editor_title: "Edit password entry",
    search_placeholder: "Search",
    no_passwords_found: "No matched passwords.",
    signin: "Sign In",
    signin_user_placeholder: "Email",
    signin_pass_placeholder: "Password",
    signout: "Sign Out",
    api_error: {
        'no user with matched password': "No user with matched password.",
        'access token is not valid': "Access token is not valid"
    }
};
