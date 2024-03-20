import fs from 'fs';
import { Step } from '../step';
import { Stdio, runCommand } from 'lib/utils/exec';
import { getDevelopmentPath, getPath } from 'lib/utils/paths';
import { yellow } from 'console-log-colors';

export class InstallMise extends Step {
    developmentFolder: string;
    misePath: string = getPath("~/.local/bin/mise");
    constructor() {
        super();
        this.developmentFolder = getDevelopmentPath();
    }

    projectPath() {
        return `${this.developmentFolder}/iOS`;
    }

    async installCheck() {
        try {
            const version = await runCommand(`${this.misePath} version`)
            return { valid: true, reason: `mise ${version.trim()} is installed` }
        } catch {
            return { valid: false, reason: "mise is not installed" }
        }
    }

    name() {
        return "Install mise-en-place";
    }

    async installStep() {
        await runCommand(`curl https://mise.run | sh`, {}, { stdio: Stdio.Inherit })
        await runCommand(`source ~/.zshrc`)
        if (fs.existsSync(this.projectPath())) {
            await runCommand(`cd ${this.projectPath} && ${this.misePath} install`, {}, { stdio: Stdio.Inherit })
        } else {
            console.log(yellow(`⚠️: mise didn't auto-install dependencies since the iOS folder doesn't exist at ${this.projectPath()}. Run 'mise install' in the iOS folder to install dependencies.`))
        }
    }
}