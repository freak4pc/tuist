import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class InstallTeleport extends Step {
    async installCheck() {
        try {
            await runCommand('teleport version');
        } catch(e: any) {
            return { valid: false, reason: `Teleport is not installed. Failed to run 'teleport version'. ${e.message} ` };
        }
        return { valid: true };
    }

    name() {
        return "Install Teleport";
    }

    async installStep() {
        console.log("installing teleport");
        await runCommand('curl -O https://cdn.teleport.dev/teleport-ent-13.3.4.pkg');
        await runCommand('sudo installer -pkg teleport-ent-13.3.4.pkg -target /');
    }
}