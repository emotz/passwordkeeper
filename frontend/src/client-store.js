import _ from 'lodash';
import * as logger from 'src/services/logger';

export class ClientStore {
  /**
  *
  * @param {string} key
  */
  constructor(key) {
    this.key = _.camelCase('pk-' + key);
  }

  get() {
    let val = window.localStorage.getItem(this.key);
    if (val === null) return undefined;
    try {
      const { value } = JSON.parse(val);
      return value;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  set(val) {
    if (val === undefined) this.remove(this.key);
    else window.localStorage.setItem(this.key, JSON.stringify({ value: val }));
  }

  remove() {
    window.localStorage.removeItem(this.key);
  }
}
