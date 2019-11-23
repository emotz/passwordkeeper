import PkAbout from 'src/components/pk-about.vue';
import router from 'src/plugins/router.js';
import { Vue } from './vue-helper.js';

describe("about tests", function() {
  it("should contain greeting message", function() {
    const Component = Vue.extend(PkAbout);
    const component = new Component({ router }).$mount();

    expect(component.$el.innerHTML.length > 10).toBe(true);
  });
});
