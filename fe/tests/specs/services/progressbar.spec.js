import progressbarInjector from 'inject-loader!src/services/progressbar.js';

describe("progressbar tests", function () {
    it("should start and stop", function () {
        const NProgress = {
            start: jasmine.createSpy("nprogress start"),
            done: jasmine.createSpy("nprogress done")
        }
        const progressbar = progressbarInjector({
            'nprogress': NProgress
        }).default;

        progressbar.start();
        expect(NProgress.start).toHaveBeenCalledTimes(1);
        progressbar.stop();
        expect(NProgress.done).toHaveBeenCalledTimes(1);
    });

    it("should start several times", function () {
        const NProgress = {
            start: jasmine.createSpy("nprogress start"),
            done: jasmine.createSpy("nprogress done")
        }
        const progressbar = progressbarInjector({
            'nprogress': NProgress
        }).default;

        progressbar.start();
        progressbar.start();
        expect(NProgress.start).toHaveBeenCalledTimes(1);
        progressbar.stop();
        expect(NProgress.done).not.toHaveBeenCalled();
        progressbar.stop();
        expect(NProgress.done).toHaveBeenCalledTimes(1);
    });

    it("should chain start and stop", function () {
        const NProgress = {
            start: jasmine.createSpy("nprogress start"),
            done: jasmine.createSpy("nprogress done")
        }
        const progressbar = progressbarInjector({
            'nprogress': NProgress
        }).default;

        progressbar.start();
        progressbar.start();
        expect(NProgress.start).toHaveBeenCalledTimes(1);
        progressbar.stop();
        expect(NProgress.done).not.toHaveBeenCalled();
        progressbar.stop();
        expect(NProgress.done).toHaveBeenCalledTimes(1);

        progressbar.start();
        expect(NProgress.start).toHaveBeenCalledTimes(2);
        progressbar.stop();
        expect(NProgress.done).toHaveBeenCalledTimes(2);
    });

    if ("should wrap function", function (done) {
        const NProgress = {
            start: jasmine.createSpy("nprogress start"),
            done: jasmine.createSpy("nprogress done")
        }
        const progressbar = progressbarInjector({
            'nprogress': NProgress
        }).default;

        const promise = new Promise((resolve, reject) => { resolve("resolved"); });

        progressbar.wrap(() => promise).then(() => {
            expect(NProgress.start).toHaveBeenCalledTimes(1);
            expect(NProgress.done).toHaveBeenCalledTimes(1);
            done();
        });
    });

    if ("should wrap promise", function (done) {
        const NProgress = {
            start: jasmine.createSpy("nprogress start"),
            done: jasmine.createSpy("nprogress done")
        }
        const progressbar = progressbarInjector({
            'nprogress': NProgress
        }).default;

        const promise = new Promise((resolve, reject) => { resolve("resolved"); });

        progressbar.wrap(promise).then(() => {
            expect(NProgress.start).toHaveBeenCalledTimes(1);
            expect(NProgress.done).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
