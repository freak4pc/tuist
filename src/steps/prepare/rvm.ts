import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class RvmInstaller extends Step {
    async installCheck() {
        try {
            await runCommand('rvm --version');
        } catch(e: any) {
            return { valid: false, reason: `RVM is not installed. Failed to run 'rvm --version'. ${e.message} ` };
        }
        return { valid: true };
    }
    name() {
        return "Install RVM";
    }
    async installStep() {
        console.log("installing RVM");
        await runCommand('curl -sSL https://get.rvm.io | bash -s stable');
        await runCommand('source "$HOME/.rvm/scripts/rvm"');
    }
}