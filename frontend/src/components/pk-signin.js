import * as logger from 'src/services/logger.js';
import * as auth from 'src/services/auth.js';
import { Modal } from 'vue-bootstrap-modal';

export default {
  components: { Modal },
  data() {
    return {
      login: "",
      password: "",
      show_password: false
    };
  },
  methods: {
    async ok() {
      try {
        await auth.login(this.login, this.password);
      } catch (err) {
        logger.error(err);
        return;
      }
      this.$emit("ok");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
