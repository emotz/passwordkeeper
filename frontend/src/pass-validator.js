/**
 * Contains array of validation error messages for each of the property
 */
class ValidationResult {
    constructor() {
        this.title_errors = [];
        this.user_errors = [];
        this.password_errors = [];
    }

    is_valid() {
        return this.title_errors.length === 0 && this.user_errors.length === 0 && this.password_errors.length === 0;
    }
    add_error(prop, message) {
        this[prop].push(message);
    }
}

/**
 *
 * @param {*} pass_entry
 * @returns {ValidationResult}
 */
function validate(pass_entry) {
    let res = new ValidationResult();
    if (pass_entry.title.length <= 0) {
        res.add_error('title_errors', "Title cannot be empty.");
    }
    if (pass_entry.user.length <= 0) {
        res.add_error('user_errors', "User cannot be empty.");
    }
    return res;
}

export { validate };
