import _ from 'lodash';
import { DispatchObj, DispatchOp, get_last_op, add_new_op, update_op_status } from './dispatchobj.js';

class DispatchCommand {
    /**
     * 
     * @param {function} action Async action, must return Promise
     */
    constructor(action) {
        this.action = action;
    }
}

/**
 * It is used to work with async commands(operations) which have a rule that 
 * only one command can be executing at the same time.
 */
class DispatchManager {
    constructor(commands) {
        this.commands = commands || {};
    }
    /**
     * Dispatches a command
     * @param {DispatchObj} dispatchobj 
     * @param {string} name Name of command to be dispatched
     * @param {*} payload It will be passed to the command execution
     */
    dispatch(dispatchobj, name, payload) {
        return new Promise((resolve, reject) => {
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
            let op = add_new_op(dispatchobj, new DispatchOp('inprogress', command.name));
            command.action(payload).then(val => {
                update_op_status(dispatchobj, op, 'success');
                resolve(val);
            }, val => {
                update_op_status(dispatchobj, op, 'failure');
                reject(val);
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

export { DispatchManager, DispatchObj, get_last_op };