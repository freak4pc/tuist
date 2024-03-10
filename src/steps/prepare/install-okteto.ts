import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasCommand } from "lib/utils/checks";

export class InstallOkteto extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        if(!await hasCommand('okteto version')) {
            return { valid: false, reason: `Okteto is not installed. Command not found.` };
        }
        return { valid: true };
    }

    name() {
        return "Install Okteto";
    }

    async installStep() {
        await runCommand('curl https://get.okteto.com -sSfL | OKTETO_VERSION=2.13.0 sh');
    }
}