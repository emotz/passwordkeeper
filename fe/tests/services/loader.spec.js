// import loaderInjector from 'inject-loader!src/services/loader.js';

// describe("progressbar tests", function () {
//     it("should call notify on success", function (done) {
//         const notify = {
//             success: jasmine.createSpy("notify success"),
//             error: jasmine.createSpy("notify error")
//         }
//         const loader = loaderInjector({
//             './notify': notify
//         });
//         const promise = new Promise((resolve, reject) => { resolve("resolved"); });

//         loader.perform(promise).then(() => {
//             expect(notify.success).toHaveBeenCalledTimes(1);
//             done();
//         });
//     });

//     it("should call notify on error", function () {
//         const notify = {
//             success: jasmine.createSpy("notify success"),
//             error: jasmine.createSpy("notify error")
//         }
//         const loader = loaderInjector({
//             './notify': notify
//         });
//         const promise = new Promise((resolve, reject) => { reject("rejected"); });

//         loader.perform(promise).then(() => {
//             expect(notify.error).toHaveBeenCalledTimes(1);
//             done();
//         });
//     });

// });
