import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';

export class AwsCreds extends Step {
    async installCheck() {
        if(!fs.existsSync(`${os.homedir()}/.awscreds`)) {
            return { valid: false, reason: "AWS credentials are not set" };
        }
        return { valid: true };
    }

    name() {
        return "Set AWS Credentials";
    }

    async installStep() {
        runCommand(`touch ~/.awscreds`);
        runCommand(`chmod +x ~/.awscreds`);
    }
}