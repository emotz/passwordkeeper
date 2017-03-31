import toastr from 'toastr';
import 'toastr.css';

/**
 * You probably want to use {@link Loader} instead of this.
 */
function success(message) {
    toastr.success(message);
}

/**
 * You probably want to use {@link Loader} instead of this.
 */
function error(message) {
    toastr.error(message);
}

export default {
    success,
    error
};
