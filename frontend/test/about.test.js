import { Vue } from './vue-helper.js';
import PkAbout from 'src/components/pk-about.vue';

describe("about tests", function() {
  it("should contain greeting message", function() {
    const component = new Vue(PkAbout).$mount();

    expect(component.$el.innerHTML.length > 10).toBe(true);
  });
});
