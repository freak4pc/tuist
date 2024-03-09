import fs from "fs";
import { Step } from "../step";
import { runCommand } from "lib/utils/exec";
import { getPath } from "lib/utils/paths";

export class GitClone extends Step {
    repo: string;
    destination: string;
    constructor(repo: string, destination: string) {
        super();
        this.repo = repo;
        this.destination = getPath(destination);
    }

    name() {
        return `Git clone ${this.repo} to ${this.destination}`;
    }

    async installCheck() {
        if(!fs.existsSync(this.destination)) {
            return { valid: false, reason: "dotfiles folder does not exist" };
        }
        return { valid: true };
    }

    async installStep() {
        await runCommand(`git clone ${this.repo} ${this.destination}`);
    }
}