import { Modal } from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    methods: {
        ok() {
            this.$emit('ok');
        },
        cancel() {
            this.$emit("cancel");
        }
    }
};
