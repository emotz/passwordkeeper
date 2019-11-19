import assert from 'assert';
import * as logger from 'src/services/logger';

export class Counter {
  constructor({ onEnable, onDisable }) {
    assert(onEnable);
    this.counter = 0;
    this.onEnable = onEnable;
    this.onDisable = onDisable;

    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }

  enable() {
    assert(this.counter >= 0);
    if (this.counter <= 0) {
      this.counter = 1;

      const res = this.onEnable();
      if (res) {
        if (this.onDisable) {
          logger.warn(new Error('both `onEnable` return value and `onDisable` callback were provided, giving priority to latter'));
        } else {
          this.onDisable = res;
        }
      } else {
        if (this.onDisable) {
          // nothing to do
        } else {
          logger.warn(new Error('both `onEnable` return value and `onDisable` callback were NOT provided'));
        }
      }
    } else {
      this.counter += 1;
    }

    return this.disable;
  }

  disable() {
    assert(this.counter > 0);
    if (this.counter > 1) {
      this.counter -= 1;
    } else if (this.counter < 1) {
      logger.warn(new Error('trying to disable already disabled counter'));
      this.counter = 0;
    } else {
      this.counter = 0;

      if (this.onDisable) {
        this.onDisable();
      }
    }
  }
}
