import _ from 'lodash';
import { DispatchObj, DispatchOp, get_last_op, add_new_op, update_op_status, get_last_last_op } from './dispatchobj.js';

export class DispatchCommand {
    /**
     * 
     * @param {function} action Async action, must return Promise
     */
    constructor(action) {
        this.action = action;
        this.with_delay = true;
    }
}

function reflect(promise) {
    return promise.then(function (v) {
        return {
            value: v,
            succeed: true
        };
    }, function (e) {
        return {
            value: e,
            succeed: false
        };
    });
}

function delay_promise(promise, time) {
    time = time === undefined ? 500 : time;
    let delaying = new Promise((resolve, reject) => {
        _.delay(() => {
            resolve();
        }, time);
    });
    return Promise.all([promise, delaying].map(reflect)).then(results => {
        let result = results[0];
        if (result.succeed) return result.value;
        throw result.value;
    });
}

/**
 * It is used to work with async commands(operations) which have a rule that 
 * only one command can be executing at the same time. Does not support calling dispatch
 * or enqueue from within dispatch or enqueue.
 */
class DispatchManager {
    constructor(commands) {
        this.commands = commands || {};
        this.queue = [];
    }
    /**
     * Dispatches a command
     * @param {DispatchObj} dispatchobj 
     * @param {string} name Name of command to be dispatched
     * @param {*} payload It will be passed to the command execution
     */
    dispatch(dispatchobj, name, payload) {
        let try_queue = () => {
            let params = this.queue.splice(0, 1)[0];
            if (params === undefined) return;
            do_work(...params);
        };

        let do_work = (dispatchobj, name, payload, resolve, reject) => {
            /** @type {DispatchCommand} */
            let command = this.commands[name];
            if (_.isEmpty(command)) {
                reject(`No command '${name}' was registered or it is empty.`);
                return;
            }
            if (!this.can_dispatch(dispatchobj)) {
                reject("Previous command hasn't finished yet.");
                return;
            }
            let op = add_new_op(dispatchobj, new DispatchOp('inprogress', name));
            let wrapper = command.with_delay ? delay_promise : _.identity;
            wrapper(command.action(payload))
                .then(val => {
                    update_op_status(dispatchobj, op, 'success');
                    resolve(val);
                }, val => {
                    update_op_status(dispatchobj, op, 'failure');
                    reject(val);
                })
                .then(try_queue, try_queue);
        };

        return new Promise((resolve, reject) => {
            do_work(dispatchobj, name, payload, resolve, reject);
        });
    }
    /** It is same as dispatch, but executes after last command finishes. */
    enqueue(dispatchobj, name, payload) {
        if (this.can_dispatch(dispatchobj)) return this.dispatch(dispatchobj, name, payload);
        return new Promise((resolve, reject) => {
            this.queue.push({
                dispatchobj: dispatchobj,
                name: name,
                payload: payload,
                resolve: resolve,
                reject: reject
            });
        });
    }
    /**
     * 
     * @param {DispatchObj} dobj
     * @returns {boolean}
     */
    can_dispatch(dobj) {
        if (get_last_op(dobj).status === 'inprogress') return false;
        return true;
    }
}

export { DispatchManager, DispatchObj, get_last_op, get_last_last_op };