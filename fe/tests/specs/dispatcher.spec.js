import * as dispatcher from 'src/dispatcher.js';
import _ from 'lodash';

describe("dispatcher tests", function () {
    it("should create manager and dispatch some actions", function (done) {
        let dobj = new dispatcher.DispatchObj();
        let counter = 0;

        let saveCommand = {
            action: function (payload) {
                counter++;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(payload);
                    }, 1000);
                });
            }
        };

        let manager = new dispatcher.DispatchManager({
            save: saveCommand
        });
        expect(counter).toBe(0);
        expect(dobj.history.length).toBe(0);
        let promise = manager.dispatch(dobj, 'save', "somepayload");
        expect(counter).toBe(1);
        expect(dobj.history.length).toBe(1);
        manager.dispatch(dobj, 'save', "somepayload");
        expect(counter).toBe(1);
        expect(dobj.history.length).toBe(1);

        promise.then(() => {
            expect(dispatcher.get_last_op(dobj).status).toEqual('success');
            manager.dispatch(dobj, 'save', "somepayload");
            expect(counter).toBe(2);
            expect(dobj.history.length).toBe(2);
            done();
        });
    });
});