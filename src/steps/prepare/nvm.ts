import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';
import { hasCommand, hasEnvSet, hasFile } from 'lib/utils/checks';

export class InstallNvm extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        if(!await hasEnvSet('NVM_DIR')) {
            return { valid: false, reason: "Nvm is not installed. No $NVM_DIR" };
        }

        if(!hasFile(`~/.nvm`)) {
            return { valid: false, reason: "Nvm is not installed. No ~/.nvm" };
        }

        if(!await hasCommand('nvm --version')) {
            return { valid: false, reason: "Nvm is not installed. command not found" };
        }
        
        if(!(await runCommand('nvm list')).includes('16.14')) {
            return { valid: false, reason: "Node 16.14 is not installed" };
        }

        if(!(await runCommand('nvm list')).includes('18.12')) {
            return { valid: false, reason: "Node 18.12 is not installed" };
        }

        return { valid: true, reason: "Already installed nvm && node 16.14"}
    }

    name() {
        return "Install nvm";
    }

    async installStep() {
        console.log("Installing nvm")
        await runCommand('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash');
        console.log("Adding nvm to shell")
        await runCommand('echo "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh  # This loads NVM" >> ~/.zshrc');
        
        // adding nvm to zsh
        

        console.log("Sourcing nvm")
        await runCommand('. $HOME/.nvm/nvm.sh');
        
        console.log("Installing node 16.14")
        await runCommand('nvm install 16.14');

        console.log("Installing node 18.12")
        await runCommand('nvm install 18.12');
        
        console.log("Setting node 16.14 as default")
        await runCommand('nvm alias default 16.14');
    }
}