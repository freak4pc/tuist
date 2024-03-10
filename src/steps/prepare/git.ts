import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';
import { hasCommand } from 'lib/utils/checks';

export class InstallGit extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        if(!await hasCommand('git --version')) {
            return { valid: false, reason: "Git is not installed. Command git not found." };
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