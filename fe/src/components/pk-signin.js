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
            password: "",
            signin: utls.make_fn_singleton(() => {
                // TODO: add validation for user password
                return loader.perform(auth.login(this.user, this.password), () => { }, res => i18n.t('api_error.' + res.body.reason)).then(() => {
                    this.user = "";
                    this.password = "";
                });
            }),
            signout: utls.make_fn_singleton(() => {
                return loader.perform(auth.logout(), () => { }, res => i18n.t('api_error.' + res.body.reason));
            })
        };
    }
};
