import { Step } from '../step';
import { Stdio, runCommand } from 'lib/utils/exec';
import { askQuestion, askPassword, pressAnyKeyToContinue, yesOrNo } from "lib/utils/question";
import fs from 'fs';

export class InstallXcode extends Step {
    async installCheck() {
        try {
            if (!fs.existsSync("/Applications/Xcode.app")) {
                return { valid: false, reason: "Xcode is not installed" };
            }

            const version = await runCommand("xcodebuild -version | head -n 1");
            return { valid: true, reason: `${version.trim()} is installed` };
        } catch(e: any) {
            return { valid: false, reason: "Xcode is not installed" };
        }
    }

    name() {
        return "Install Xcode";
    }

    async installStep() {
        const version = "--latest"
        console.log("Let's get Xcode installed for you!");

        const hasAccount = await yesOrNo("Do you have an AppStore Connect Apple ID with a @monday.com email?");

        if(!hasAccount) {
            console.log("Ask a team member to invite you to monday's AppStore Connect account and run this script again.");
            await pressAnyKeyToContinue();
        }

        const username = askQuestion("Apple ID: ");
        const password = askPassword("Password: ");
        console.log(`Trying AppStore Connect for ${username}...`)

        console.log("Installing Latest Xcode...")

        // Install
        await runCommand(
            `XCODES_USERNAME=${username} XCODES_PASSWORD=${password} xcodes install ${version} --experimental-unxip`, {},
            { stdio: Stdio.Inherit }
        );

        // Move to the right place
        await runCommand(`mv /Applications/Xcode*.app /Applications/Xcode.app`);

        // Select the right version
        console.log("Selecting Xcode, you'll need to type in your password...")
        await runCommand(`sudo xcode-select -s /Applications/Xcode.app`, {}, { stdio: Stdio.Inherit });
    }
}