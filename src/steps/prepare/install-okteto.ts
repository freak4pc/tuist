import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class InstallOkteto extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            await runCommand('okteto version');
        } catch(e: any) {
            return { valid: false, reason: `Okteto is not installed. Failed to run 'okteto version'. ${e.message} ` };
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