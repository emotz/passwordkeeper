import * as logger from 'src/services/logger';

export class Counter {
  _counter = 0;

  constructor({ onEnable, onDisable }) {
    assert(onEnable);
    this.onEnable = onEnable;
    this.onDisable = onDisable;
  }

  enable = () => {
    assert(counter >= 0);
    if (counter <= 0) {
      counter = 1;

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
      counter += 1;
    }

    return this.disable;
  }

  disable = () => {
    assert(counter > 0);
    if (counter > 1) {
      counter -= 1;
    } else if (counter < 1) {
      logger.warn(new Error('trying to disable already disabled counter'));
      counter = 0;
    } else {
      counter = 0;

      if (this.onDisable) {
        this.onDisable();
      }
    }
  }
}
