import fs from 'fs';
import os from "os";
import { Step } from '../step';
import { hasFile } from 'lib/utils/checks';
import { getPath } from 'lib/utils/paths';

export class CreateDevelopmentFolder extends Step {
    developmentFolder: string;

    constructor() {
        super();
        this.developmentFolder = getPath('~/Development');
    }
    async installCheck() {
        if(!hasFile(this.developmentFolder)) {
            return { valid: false, reason: "Development folder does not exist" };
        }
        return { valid: true };
    }

    name() {
        return "Create Development Folder";
    }

    async installStep() {
        fs.mkdirSync(this.developmentFolder);
    }
}