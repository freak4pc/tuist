import { Stdio, runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class InstallBrewPackages extends Step {
    packages: string[];

    cask: boolean;
    force: boolean;
    constructor(packages: string[], {force = false, cask = false}: {force?: boolean, cask?: boolean} = {}) {
        super();
        this.packages = packages;

        this.force = force;
        this.cask = cask;
    }
    
    async installCheck() {
        for(const curpackage of this.packages) {
            try {
                const shortName = curpackage.split('/')[curpackage.split('/').length - 1];
                const showList = await runCommand(`brew list ${curpackage}`, {}, { detailedError: false });

                if(!showList.includes(shortName)) {
                    console.log("show list", showList, shortName, curpackage)
                    return { valid: false, reason: `Package ${curpackage} is not listed` };
                }
            } catch(e: any) {
                if(e.message.includes('No such keg')) {
                    return { valid: false, reason: `Package ${curpackage} is not installed` };
                }
                return { valid: false, reason: `Package ${curpackage} has error while checked. ${e.message}` };
            }
        }
        return { valid: true, reason: "Already installed brew packages" };
    }
    name() {
        return `Install Brew Packages ${this.packages.join(', ')}`;
    }
    async installStep() {
        console.log(`install brew packages! ${this.packages.join(', ')}`)
        await runCommand(`brew install ${this.force ? '--force ' : ''}${this.cask ? '--cask ' : ''}${this.packages.join(' ')}`, {}, { stdio: Stdio.Inherit });
    }
}