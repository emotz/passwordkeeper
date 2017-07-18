import { init } from 'command-decorator';
import { make_reactive } from 'src/services/watch.js';

init({
    make_reactive: make_reactive
});
