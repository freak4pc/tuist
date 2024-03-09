import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

export class SetEnvVariable extends Step {
    env: string;
    value: string;
    constructor(env: string, value: string) {
        super();
        this.env = env;
        this.value = value;
    }
    async installCheck() {
        const value = (await runCommand(`echo $${this.env}`)).trim();
        if(value !== this.value) {
            return { valid: false, reason: `Environment variable ${this.env} is not set to ${this.value}. its set to ${value}` };
        }
        return { valid: true };
    }

    name() {
        return `Set Environment Variable ${this.env} to ${this.value}`;
    }

    async installStep() {
        await runCommand(`echo "export ${this.env}=${this.value}" >> ~/.zshrc`);
    }
}