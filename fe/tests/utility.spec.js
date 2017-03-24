import * as utls from 'src/utility';
import _ from 'lodash';

describe("merge_arrays_of_objects tests", function () {
    function test_arr() {
        return [
            {
                prop1: "somevalues",
                prop2: "another value"
            },
            {
                prop1: "anothervalue",
                prop2: "yet another value"
            }];
    }
    function test_ctor(val) {
        return {
            prop3: val
        };
    }

    it("should merge empty arrays", function () {
        let arr = [];
        utls.merge_arrays_of_objects(arr, []);

        expect(arr).toEqual([]);
    });
    it("should merge non-empty array into empty array", function () {
        let result = [];
        let from = test_arr();

        utls.merge_arrays_of_objects(result, from, 'prop1');

        expect(result).toEqual(from);
    });
    it("should merge non-empty array into empty array with default ctor", function () {
        let result = [];
        let from = test_arr();

        let expectedProp3 = 'defaultvalue';
        let expected = from.map(i => {
            let res = _.clone(i);
            res.prop3 = expectedProp3;
            return res;
        });

        utls.merge_arrays_of_objects(result, from, 'prop1', () => test_ctor(expectedProp3));

        expect(result).toEqual(expected);
    });
    it("should merge non-empty array into non-empty array with default ctor", function () {
        let result = test_arr();
        let expectedAnotherObj = { prop2: 'asdf', prop1: 'vcxqz' };
        result.push(_.clone(expectedAnotherObj));

        let from = test_arr();
        from[0].prop2 = "changed value";

        let expectedProp3 = 'defaultvalue';
        let expected = _.clone(from);
        expected.push(expectedAnotherObj);

        utls.merge_arrays_of_objects(result, from, 'prop1', () => test_ctor(expectedProp3));

        expect(result).toEqual(expected);
    });
});

describe("generateUniqueId tests", function () {
    it("should generate non-empty id", function () {
        const res = utls.generateUniqueId();
        // should be non empty string
        expect(res).not.toBeUndefined();
        expect(res).not.toBeNull();
        expect(typeof (res)).toEqual('string');
        expect(res.length > 0).toBe(true);
    });
    if ("should generate different ids", function () {
        const first = utls.generateUniqueId();
        const second = utls.generateUniqueId();
        expect(first).not.toEqual(second);
    });
});

describe("make_fn_singleton tests", function () {
    it("should pass async test", function (done) {
        const expectedstr = "hello";
        const fn = () => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(expectedstr);
                }, 1000);
            });
        };
        fn().then(str => {
            expect(str).toEqual(expectedstr);
            done();
        });
    });
    it("should chain promises", function (done) {
        const expectedstr = "hello";
        const fn = () => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(expectedstr);
                }, 1000);
            });
        };
        fn().then(str => {
            expect(str).toEqual(expectedstr);
            return fn();
        }).then(str => {
            expect(str).toEqual(expectedstr);
            done();
        });
    });
    it("should make a function 'singleton'", function (done) {
        let counter = 0;
        const expectedcounter = 1;
        const fn = utls.make_fn_singleton(() => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(++counter);
                }, 1000);
            });
        });

        const p1 = fn().then(val => {
            expect(val).toBe(expectedcounter);
        });
        const p2 = fn().then(val => {
            expect(val).toBe(expectedcounter);
        });
        Promise.all([p1, p2]).then(() => { done(); });
    });
    it("should be able to reexecute if already finished", function (done) {
        let counter = 0;
        const expectedcounter1 = 1;
        const expectedcounter2 = 2;
        const fn = utls.make_fn_singleton(() => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(++counter);
                }, 1000);
            });
        });

        fn().then(val => {
            expect(val).toBe(expectedcounter1);
            return fn();
        }).then(val => {
            expect(val).toBe(expectedcounter2);
            done();
        });
    });
    it("should register watch", function (done) {
        let counter = 0;
        const expectedcounter = 1;
        const fn = utls.make_fn_singleton(() => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(++counter);
                }, 1000);
            });
        });
        let onbefore = jasmine.createSpy('spy');
        fn.watch(onbefore);

        fn().then(val => {
            expect(val).toBe(expectedcounter);
            expect(onbefore).toHaveBeenCalledTimes(1);
            expect(fn.is_executing()).toBe(false);
            done();
        });
        expect(fn.is_executing()).toBe(true);
        expect(onbefore).toHaveBeenCalledTimes(1);
    });
    it("should unregister watch 1", function (done) {
        let counter = 0;
        const expectedcounter = 1;
        const fn = utls.make_fn_singleton(() => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(++counter);
                }, 1000);
            });
        });
        let onbefore = jasmine.createSpy('spy');
        fn.watch(onbefore)();

        fn().then(val => {
            expect(val).toBe(expectedcounter);
            expect(onbefore).not.toHaveBeenCalled();
            expect(fn.is_executing()).toBe(false);
            done();
        });
        expect(fn.is_executing()).toBe(true);
        expect(onbefore).not.toHaveBeenCalled();
    });
    it("should unregister watch 2", function (done) {
        let counter = 0;
        const expectedcounter = 1;
        const fn = utls.make_fn_singleton(() => {
            return new Promise((resolve, reject) => {
                _.defer(() => {
                    resolve(++counter);
                }, 1000);
            });
        });
        let onbefore = jasmine.createSpy('spy');
        fn.watch(onbefore);
        fn.unwatch(onbefore);

        fn().then(val => {
            expect(val).toBe(expectedcounter);
            expect(onbefore).not.toHaveBeenCalled();
            expect(fn.is_executing()).toBe(false);
            done();
        });
        expect(fn.is_executing()).toBe(true);
        expect(onbefore).not.toHaveBeenCalled();
    });


});