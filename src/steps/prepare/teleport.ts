import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasCommand } from "lib/utils/checks";

export class InstallTeleport extends Step {
    async installCheck() {
        if(!await hasCommand('teleport version')) {
            return { valid: false, reason: "Teleport is not installed. Command Teleport not found." };
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