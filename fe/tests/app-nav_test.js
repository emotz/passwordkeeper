import { Vue } from './vue-helper.js';

import AppNav from 'src/app-nav.vue';
import router from 'src/router.js';

describe("app-nav tests", function () {
    function is_there_route_for_location(location) {
        return router.getMatchedComponents(location).length > 0;
    }

    beforeEach(function () {
        jasmine.addMatchers({
            toBeRegisteredInRouter: function () {
                return {
                    compare: function (location) {
                        var result = { pass: is_there_route_for_location(location) };
                        if (result.pass) {
                            result.message = `Expected location ${location} not to be registered in router`;
                        } else {
                            result.message = `Expected location ${location} to be registered in router`;
                        }
                        return result;
                    }
                };
            }
        });
    });

    it("should not contain non-registered links", function () {
        const Component = Vue.extend(AppNav);

        const component = new Component({ router }).$mount();

        component.$children.forEach(function (child) {
            const location = child._props.to;
            if (location === undefined) return;
            expect(location).toBeRegisteredInRouter();
        });
    });
});
