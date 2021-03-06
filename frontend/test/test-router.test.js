import { Vue } from './vue-helper.js';
import VueRouter from 'vue-router';

describe("test-router tests", function() {
  Vue.use(VueRouter);

  it("should mount without errors", function() {
    const Component = Vue.extend({
      template: '<router-link to="/home">Home</router-link>',
    });

    new Component({
      router: new VueRouter()
    }).$mount();
  });
});
