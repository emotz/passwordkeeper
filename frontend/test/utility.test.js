import * as utls from 'src/utility';
import _ from 'lodash';

describe("merge_arrays_of_objects tests", function() {
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

    it("should merge empty arrays", function() {
        let arr = [];
        utls.merge_arrays_of_objects(arr, []);

        expect(arr).toEqual([]);
    });
    it("should merge non-empty array into empty array", function() {
        let result = [];
        let from = test_arr();

        utls.merge_arrays_of_objects(result, from, 'prop1');

        expect(result).toEqual(from);
    });
    it("should merge non-empty array into empty array with default ctor", function() {
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
    it("should merge non-empty array into non-empty array with default ctor", function() {
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

describe("generateUniqueId tests", function() {
    it("should generate non-empty id", function() {
        const res = utls.generateUniqueId();
        // should be non empty string
        expect(res).not.toBeUndefined();
        expect(res).not.toBeNull();
        expect(typeof (res)).toEqual('string');
        expect(res.length > 0).toBe(true);
    });
    it("should generate different ids", function() {
        const first = utls.generateUniqueId();
        const second = utls.generateUniqueId();
        expect(first).not.toEqual(second);
    });
});
