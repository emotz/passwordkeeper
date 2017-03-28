import { Vue } from './vue-helper.js';
import About from 'src/components/about.vue';

describe("about tests", function () {
    it("should contain greeting message", function () {
        const component = new Vue(About).$mount();

        expect(component.$children).toEqual([]);
        expect(component.$el.innerHTML.length > 10).toBe(true);
    });
});
