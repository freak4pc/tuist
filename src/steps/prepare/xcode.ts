import { pressAnyKeyToContinue } from 'lib/utils/question';
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

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
        await runCommand('xcode-select --install');
        console.log("An installer window should now open. Please click the \"Install\" button to install the command line tools.\nPress any key when the installation is done.")
        await pressAnyKeyToContinue();
    }
}