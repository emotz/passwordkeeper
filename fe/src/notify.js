import toastr from 'toastr';
import 'toastr.css';

function success(message) {
    toastr.success(message);
}

function error(message) {
    toastr.error(message);
}

export default {
    success,
    error
};
