import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { askQuestion } from "lib/utils/question";

export class GitConfig extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        const name = (await runCommand('git config --global user.name')).trim();
        const email = (await runCommand('git config --global user.email')).trim();
        if(!email || !name) {
            console.log("Need to configure git name and email")
        }
        if(!email.includes('@monday.com')) {
            return { valid: false, reason: "Git email is not configured to @monday.com" };   
        }
        return { valid: true };
    }

    name() {
        return "Git Config";
    }

    async installStep() {
        const fullName = askQuestion("What is your full name?");
        const email = askQuestion("What is your monday.com email?");        
        await runCommand(`git config --global user.name "${fullName}"`);
        await runCommand(`git config --global user.email "${email}"`);
        await runCommand('git config --global --add --bool push.autoSetupRemote true');
    }
}