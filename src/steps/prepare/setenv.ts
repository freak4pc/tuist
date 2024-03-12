import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';
import { hasEnvSetTo } from 'lib/utils/checks';

export class SetEnvVariable extends Step {
    env: string;
    value: string;
    constructor(env: string, value: string) {
        super();
        this.env = env;
        this.value = value;
    }
    async installCheck() {
        if(!await hasEnvSetTo(this.env, this.value)) {
            return { valid: false, reason: `Environment variable ${this.env} is not set to ${this.value}` };
        }
        return { valid: true };
    }

    name() {
        return `Set Environment Variable ${this.env} to ${this.value}`;
    }

    async installStep() {
        console.log(`Setting environment variable ${this.env} to ${this.value}`);
        await runCommand(`echo "export ${this.env}=${this.value}" >> ~/.zshrc`);
    }
}