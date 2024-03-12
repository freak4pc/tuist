import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';
import { hasCommand } from 'lib/utils/checks';

export class XCodeInstall extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            if(!(await runCommand('xcode-select -p')).trim()) {
                return { valid: false, reason: "Xcode is not installed. Command not found" };
            }
        } catch(e: any) {
            if (e.message.includes("command not found")) {
                return { valid: false, reason: "Xcode is not installed. Command not found" };
            }
            return { valid: false, reason: `Xcode error while checking. ${e.message}` };
        }
        
        return { valid: true, reason: "Already installed xcode, able to run xcode-select" };
    }

    name() {
        return "Install XCode";
    }

    async installStep() {
        console.log("Installing xcode")
        await runCommand('xcode-select --install');
    }
}