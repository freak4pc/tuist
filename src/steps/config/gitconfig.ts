import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { askQuestion } from "lib/utils/question";

export class GitConfig extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            const name = (await runCommand('git config --global user.name', { }, { detailedError: false })).trim();
            const email = (await runCommand('git config --global user.email', {}, { detailedError: false })).trim();
            if(!email || !name) {
                console.log("Need to configure git name and email")
            }
            if(!email.includes('@monday.com')) {
                return { valid: false, reason: "Git email is not configured to @monday.com" };   
            }
        } catch(e) {
            return { valid: false, reason: `Git config empty. ${e}` };
        }
        
        return { valid: true };
    }

    name() {
        return "Git Config";
    }

    async installStep() {
        const fullName = askQuestion("What is your full name?");
        const email = askQuestion("What is your monday.com email?");        
        console.log("Okay let's update your git config!")
        await runCommand(`git config --global user.name "${fullName}"`);
        await runCommand(`git config --global user.email "${email}"`);
        await runCommand('git config --global --add --bool push.autoSetupRemote true');
    }
}