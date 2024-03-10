
import { open } from 'openurl';
import fs from 'fs';
import os from 'os';
import { Step } from "../step";
import { runCommand } from "lib/utils/exec";
import { askPassword, askQuestion, pressAnyKeyToContinue, yesOrNo } from 'lib/utils/question';
import { red } from 'console-log-colors';

export class NpmAuth extends Step {
    async installCheck() {
        if(!fs.existsSync(`${os.homedir()}/.npmrc`)) {
            return { valid: false, reason: "No .npmrc file found in home directory" };
        }
        try {
            const whoami = await runCommand('npm whoami');
            if(!whoami || whoami.trim() === '') {
                return { valid: false, reason: "Not logged in to npm" };
            }
        } catch(e: any) {
            return { valid: false, reason: `Npm whoami failed. ${e.message}` };
        }
        const whoami = await runCommand('npm whoami');
        return { valid: true, reason: `already logged in as ${whoami}` };
    }

    name() {
        return "Npm Auth";
    }

    async installStep() {
        console.log("Let's login to npm...");
        const hasAccount = yesOrNo('Do you already have an account in npm?');
        if(!hasAccount) {
            console.log("Let's create one..");
            console.log(`We need to create a user using your ${red(`@monday.com`)} user.`);
            console.log("You'll later get an email to confirm your account.")
            console.log("Press any key to open npm signup")
            await pressAnyKeyToContinue();
            open("https://www.npmjs.com/signup");
        }
        const username = askQuestion('Username: ');
        const password = askPassword('Password: ');
        console.log(`Okay.. Let's connect to npm with ${username}`);
        await runCommand(`nvm use 18.19 && npm login --username ${username} --password ${password}`,
            {}, 
            { printWhile: true, onData: (data) => {
                const fullUrl = /https:\/\/www.npmjs.com\/login\?next=\/login\/cli\/[a-z0-9-]+/.exec(data);
              if(fullUrl) {
                console.log("Opening browser to complete login...")
                open(fullUrl[0]);
              }
            }});
    }
}