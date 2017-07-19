export default class CommandGroup {
    constructor() {
        this.commands = [];
    }
    /**
     *
     * @param {Command} cmd
     */
    add_command(cmd) {
        if (~this.commands.indexOf(cmd)) return;
        this.commands.push(cmd);
        cmd.set_group(this);
    }

    /**
     * WARNING Not reactive
     */
    is_executing() {
        return this.commands.some(cmd => cmd.is_executing());
    }
}
