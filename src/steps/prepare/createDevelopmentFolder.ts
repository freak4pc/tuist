import fs from 'fs';
import os from "os";
import { Step } from '../step';

export class CreateDevelopmentFolder extends Step {
    developmentFolder: string;

    constructor() {
        super();
        this.developmentFolder = '~/Development'.replace('~', os.homedir());
    }
    async installCheck() {
        if(!fs.existsSync(this.developmentFolder)) {
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