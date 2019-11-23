import { Counter } from 'src/counter.js';
import NProgress from 'nprogress';
import 'nprogress.css';
import './progressbar.css';

const counter = new Counter({
  onEnable() {
    NProgress.start();
  },
  onDisable() {
    NProgress.done();
  }
});

/**
 * You probably want to use {@link Loader} instead of this.
 */
export const start = counter.enable;

/**
 * You probably want to use {@link Loader} instead of this.
 */
export const stop = counter.disable;

/**
 * You probably want to use {@link Loader} instead of this.
 */
export function wrap(fn, context, ...args) {
  start();
  const res = Promise.resolve(fn instanceof Function ? fn.apply(context, args) : fn);
  return res.then(val => {
    stop();
    return val;
  }, err => {
    stop();
    throw err;
  });
}
