import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class InstallNpmPackages extends Step {
    packages: string[];
    constructor(packages: string[]) {
        super();
        this.packages = packages;
    }

    name() {
        return `Install Npm Packages ${this.packages.join(', ')}`;
    }
    
    async installCheck() {
        for(const pkg of this.packages) {
            try {
                const hasPkg = await runCommand(`npm list -g ${pkg}`);
                if(!hasPkg.includes(pkg)) {
                    return { valid: false, reason: `${pkg} is not installed` };
                }
            }
            catch(e: any) {
                return { valid: false, reason: `${pkg} has error while checked. ${e.message}` };
            }
            
        }
        return { valid: true, reason: "Already installed npm packages" };
    }

    async installStep() {
        await runCommand(`npm install -g ${this.packages.join(' ')}`);
    }
}