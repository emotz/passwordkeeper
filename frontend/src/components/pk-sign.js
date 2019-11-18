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
          throw err;
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
          throw err;
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
