import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import fs from 'fs';

export class InstallHomebrew extends Step {
    async installCheck() {
        if(!await runCommand(`brew --version`)) {
            return { valid: false, reason: "Brew is not installed. Command brew not found." };
        }
        return { valid: true, reason: "already able to run brew" };
    }

    name() {
        return "Install Brew";
    }

    async installStep() {
        console.log("install brew!")
        await runCommand(`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`);

        // add homebrew to path
        await runCommand(`echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile`);
        await runCommand(`eval "$(/opt/homebrew/bin/brew shellenv)"`);
    }
}