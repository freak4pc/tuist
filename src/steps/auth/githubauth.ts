import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class GithubAuth extends Step {
    async installCheck() {
        const authResult = await runCommand('gh auth token');
        if(authResult.trim() === "") {
            return { valid: false, reason: "Github auth token is not set" };
        }
        return { valid: true, reason: "already have a gh auth token" };
    }
    
    name() {
        return "Github Auth";
    }

    async installStep() {
        await runCommand('gh auth login');
    }
}