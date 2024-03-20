import { pressAnyKeyToContinue } from 'lib/utils/question';
import { Step } from '../step';
import { Stdio, runCommand } from 'lib/utils/exec';

export class InstallXcodeCLI extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            if(!(await runCommand('xcode-select -p')).trim()) {
                return { valid: false, reason: "Xcode command line tools are not installed. Command not found" };
            }
        } catch(e: any) {
            if (e.message.includes("command not found")) {
                return { valid: false, reason: "code command line tools are not installed. Command not found" };
            }
            return { valid: false, reason: `Xcode error while checking. ${e.message}` };
        }
        
        return { valid: true, reason: "Already installed Xcode Command Line Tools" };
    }

    name() {
        return "Install Xcode Command Line Tools";
    }

    async installStep() {
        console.log("Installing Xcode Command Line Tools")
        // This is a hack to trick the system to use the softwareupdate utility for the Xcode CLI
        await runCommand(`touch /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress;`)
        await runCommand(`PROD=$(softwareupdate -l | grep "\*.*Command Line" | tail -n 1 | sed 's/^[^C]* //') && softwareupdate -i "$PROD" --verbose;`, {}, { stdio: Stdio.Inherit });
    }
}