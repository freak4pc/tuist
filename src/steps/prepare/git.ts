import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

export class InstallGit extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        try {
            await runCommand('git --version');
        } catch(e) {
            return { valid: false, reason: "Git is not installed" };
        }
        return { valid: true, reason: "Git is already installed, already able to use git cli" };
    }

    name() {
        return "Install Git";
    }

    async installStep() {
        await runCommand('brew install git')
    }
}