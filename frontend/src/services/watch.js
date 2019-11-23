import Vue from 'vue';
import * as utls from 'src/utility.js';

const data = { reactive: {} };
const bus = new Vue({ data });
export const watch = bus.$watch.bind(bus);
// export const emit = vue.$emit.bind(vue);
// export const on = vue.$on.bind(vue);
export function make_reactive(obj) {
  Vue.set(data.reactive, `data-${utls.generateUniqueId()}`, obj);
  return obj;
}
