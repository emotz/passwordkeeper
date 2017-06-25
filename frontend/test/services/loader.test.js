import loaderInjector from 'inject-loader!babel-loader?presets[]=es2015!src/services/loader.js';

describe("loader tests", function() {
    it("should call notify on success", function(done) {
        const notify = {
            success: jasmine.createSpy("notify success"),
            error: jasmine.createSpy("notify error")
        };

        const loader = loaderInjector({
            './notify.js': notify
        });
        const promise = new Promise((resolve, reject) => { resolve("resolved"); });

        loader.perform(promise).then(() => {
            expect(notify.success).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it("should call notify on error", function(done) {
        const notify = {
            success: jasmine.createSpy("notify success"),
            error: jasmine.createSpy("notify error")
        };
        const loader = loaderInjector({
            './notify.js': notify
        });
        const promise = new Promise((resolve, reject) => { reject("rejected"); });
        loader.perform(promise).catch(() => {
            expect(notify.error).toHaveBeenCalledTimes(1);
            done();
        });
    });

});
