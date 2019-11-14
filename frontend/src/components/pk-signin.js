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
        throw err;
      }
      this.$emit("ok");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
