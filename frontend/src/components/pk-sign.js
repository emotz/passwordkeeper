import * as logger from 'src/services/logger.js';
import * as auth from 'src/services/auth.js';
import PkSignUp from './pk-signup.vue';
import PkSignIn from './pk-signin.vue';

import * as modal from 'src/services/modal.js';

export default {
  methods: {
    async signin() {
      try {
        await modal.open(PkSignIn);
      } catch (err) {
        if (typeof err === 'undefined') {
          // normal cancel
        } else {
          // something unexpected
          logger.error(err);
          return;
        }
      }
    },
    async signup() {
      let user;
      try {
        user = await modal.open(PkSignUp);
      } catch (err) {
        if (typeof err === 'undefined') {
          // normal cancel
          return;
        } else {
          // something unexpected
          logger.error(err);
          return;
        }
      }
      await auth.login(user.username, user.password);
    },
    signout() {
      return auth.logout();
    }
  },
  computed: {
    authenticated: auth.is_authenticated
  }
};
