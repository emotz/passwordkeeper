import Vue from 'vue';
import VueRouter from 'vue-router';

import AppNav from 'src/app-nav.vue';

describe("app-nav tests", function () {
    Vue.use(VueRouter);

    it("should mount without errors", function () {
        const Component = Vue.extend(AppNav);

        const component = new Component({
            router: new VueRouter()
        }).$mount();
    });
});
