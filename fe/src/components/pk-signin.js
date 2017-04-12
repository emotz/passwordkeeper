import * as auth from 'src/plugins/auth.js';
import * as loader from 'src/services/loader.js';
import * as i18n from 'src/plugins/i18n.js';
import * as utls from 'src/utility.js';

import PkAsyncButton from 'src/components/pk-async-button.vue';

export default {
    components: { PkAsyncButton },
    data() {
        return {
            user: "",
            user_error: false,
            password: "",
            password_error: false,
            show_password: false,
            signin: utls.make_fn_singleton(async () => {
                let val;
                try {
                    val = await loader.perform(
                        auth.login(this.user, this.password),
                        () => { },
                        res => i18n.t(`api_error["${res.body.reason}"]`));
                } catch (err) {
                    this.user_error = true;
                    this.password_error = true;
                    throw err;
                }
                this.user = "";
                this.password = "";
                return val;
            }),
            signout: utls.make_fn_singleton(() => {
                return loader.perform(
                    auth.logout(),
                    () => { },
                    res => i18n.t(`api_error["${res.body.reason}"]`));
            })
        };
    },
    computed: {
        authenticated: auth.is_authenticated
    },
    watch: {
        user() {
            this.user_error = false;
        },
        password() {
            this.password_error = false;
        }
    }
};