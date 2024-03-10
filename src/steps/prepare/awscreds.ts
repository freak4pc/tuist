import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { runCommand } from 'lib/utils/exec';
import { hasFile } from 'lib/utils/checks';

export class AwsCreds extends Step {
    async installCheck() {
        if(!hasFile(`~/.awscreds`)) {
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