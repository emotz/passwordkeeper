/**
 * Has to be Plain Object class to use as Vue data
 */
class DispatchOp {
    constructor(status, name) {
        this.id = _.uniqueId();
        /** 
         * Can be one of 'inprogress', 'success', 'failure'
         * @type {string} 
         */
        this.status = status;
        /** @type {string} */
        this.name = name;
    }
}

/**
 * Has to be Plain Object class to use as Vue data.
 */
class DispatchObj {
    constructor() {
        /** @type {DispatchOp[]} */
        this.history = [];
    }
}
/**
 * 
 * @param {DispatchObj} dispatchobj 
 * @returns {DispatchOp} Returns operation object of last executed operation or empty object if no operations were handled yet.
 */
function get_last_op(dispatchobj) {
    let l = dispatchobj.history.length;
    if (l <= 0) return {};
    let last_op = dispatchobj.history[l - 1];
    return last_op;
}

/**
 * 
 * @param {DispatchObj} dispatchobj 
 * @returns {DispatchOp} Returns operation object of operation preceeding last one or empty object if no operations were handled yet.
 */
function get_last_last_op(dispatchobj) {
    let l = dispatchobj.history.length;
    if (l <= 1) return {};
    let last_op = dispatchobj.history[l - 2];
    return last_op;
}

/**
 * 
 * @param {DispatchObj} dispatchobj 
 * @param {DispatchOp} op 
 * @returns {DispatchOp} Newly added operation object
 */
function add_new_op(dispatchobj, op) {
    dispatchobj.history.push(op);
    return op;
}

/**
 * 
 * @param {DispatchObj} dispatchobj 
 * @param {DispatchOp} op 
 * @param {string} status
 */
function update_op_status(dispatchobj, op, status) {
    op.status = status;
}

export { DispatchOp, DispatchObj, get_last_op, add_new_op, update_op_status, get_last_last_op };
