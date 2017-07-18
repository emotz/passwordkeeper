import _ from 'lodash';

class ClientStore {
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
        return val;
    }

    set(val) {
        if (val === undefined) this.remove(this.key);
        else window.localStorage.setItem(this.key, val);
    }

    remove() {
        window.localStorage.removeItem(this.key);
    }
}

export default ClientStore;
