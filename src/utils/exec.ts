import childProcess from 'child_process';
import util from 'util';
import fs from "fs";
import os from "os"

const exec = util.promisify(childProcess.exec);

export async function runCommand(command: string, options: Parameters<typeof exec>[1] = {}, { printWhile = false, onData }: {printWhile?: boolean, onData?: (data: string) => void } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        if((command.includes("nvm")) && fs.existsSync('/bin/zsh') && fs.existsSync(`${os.homedir()}/.zshrc`)) {
            command = `source ~/.zshrc > /dev/null 2>&1 || true && ${command}`
        }
        
        const execRes = childProcess.exec(command, {
                    cwd: process.cwd(),
                    shell: fs.existsSync('/bin/zsh') ? '/bin/zsh' : '/bin/sh',
                    env: process.env,
                    maxBuffer: 1024 * 1024 * 1024,
                    ...options
        }, (error, stdout, stderr) => {
            if (error) {
                console.log(stdout, stderr, error)
                reject(error);
            } else {
                resolve(stdout as string);
            }
        });
        execRes.stdout?.on('data', (data) => {
            if(printWhile) {
                console.log(data.toString());
            }
            if(onData) {
                onData(data.toString());
            }
        });
    });
}