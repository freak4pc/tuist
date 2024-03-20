import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class BrewAddRepos extends Step {
    repos: string[];
    constructor(repos: string[]) {
        super();
        this.repos = repos;
    }
    async installCheck() {
        for(const repo of this.repos) {
            try {
                const hasRepo = await runCommand(`brew tap | grep ${repo}`, {}, { detailedError: false } );
                if(hasRepo.trim() !== repo) {
                    return { valid: false, reason: `${repo} is already tapped` };
                }
            } catch(e: any) {
                return { valid: false, reason: `Could not check tap of ${repo}. message: ${e.message}` };
            }
        }
        return { valid: true };
    }
    name() {
        return `Brew add repos ${this.repos.join(', ')}`;
    }
    async installStep() {
        console.log(`brew add repos! ${this.repos.join(', ')}`)
        for(const repo of this.repos) {
            await runCommand(`brew tap ${repo}`);
        }
        
    }
}