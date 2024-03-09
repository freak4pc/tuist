import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

export class XCodeInstall extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            await runCommand('xcode-select -p');
        } catch(e) {
            return { valid: false, reason: "Xcode is not installed. Can't run xcode-select" };
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