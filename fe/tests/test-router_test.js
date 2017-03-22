import Vue from 'vue';
import VueRouter from 'vue-router';

describe("test-router tests", function () {
    Vue.use(VueRouter);

    it("should mount without errors", function () {
        const Component = Vue.extend({
            template: '<router-link to="/home">Home</router-link>',
        });

        const component = new Component({
            router: new VueRouter()
        }).$mount();
    });
});
