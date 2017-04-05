import NProgress from 'nprogress';
import 'nprogress.css';
import './progressbar.css';

/**
 * You probably want to use {@link Loader} instead of this.
 */
class ProgressBar {
    constructor() {
        this.counter = 0;
    }
    /**
     * You probably want to use {@link Loader} instead of this.
     */
    start() {
        if (this.counter++ === 0) {
            NProgress.start();
        }
    }
    /**
     * You probably want to use {@link Loader} instead of this.
     */
    stop() {
        if (--this.counter === 0) {
            NProgress.done();
        }
    }

    /**
     * You probably want to use {@link Loader} instead of this.
     */
    wrap(fn, context, ...args) {
        this.start();
        const res = Promise.resolve(fn instanceof Function ? fn.apply(context, args) : fn);
        return res.then(val => {
            this.stop();
            return val;
        }, err => {
            this.stop();
            throw err;
        });
    }
}
export default new ProgressBar();
