import PkConfirm from 'src/components/pk-confirm.vue';

import { open as openModal } from 'vue-bootstrap-modal';
import Vue from 'vue';

export function open(Component, propsData) {
  return openModal(Vue.extend(Component), { propsData });
}

export function confirm() {
  return open(PkConfirm);
}
