import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

export class InstallNvm extends Step {
    constructor() {
        super();
    }
    async installCheck() {
        const nvmDir = await runCommand('echo $NVM_DIR');
        if(!nvmDir || nvmDir.length <= 1) {
            return { valid: false, reason: "Nvm is not installed. No $NVM_DIR" };
        }

        if(!fs.existsSync(`${os.homedir()}/.nvm`)) {
            return { valid: false, reason: "Nvm is not installed in ~/.nvm" };
        }
        try {
            await runCommand('nvm --version');
        } catch(e) {
            return { valid: false, reason: "Nvm is not installed" };
        }
        
        if(!(await runCommand('nvm list')).includes('16.14')) {
            return { valid: false, reason: "Node 16.14 is not installed" };
        }

        if(!(await runCommand('nvm list')).includes('18.19')) {
            return { valid: false, reason: "Node 18.19 is not installed" };
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
        await runCommand('echo "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh');
        
        // adding nvm to zsh
        

        console.log("Sourcing nvm")
        await runCommand('. $HOME/.nvm/nvm.sh');
        
        console.log("Installing node 16.14")
        await runCommand('nvm install 16.14');

        console.log("Installing node 18.19")
        await runCommand('nvm install 18.19');
        
        console.log("Setting node 16.14 as default")
        await runCommand('nvm alias default 16.14');
    }
}