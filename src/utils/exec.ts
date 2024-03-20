import childProcess, { ChildProcess } from "child_process";
import util from "util";
import fs from "fs";
import os from "os";

const exec = util.promisify(childProcess.exec);

export enum Stdio {
    Pipe = "pipe",
    Inherit = "inherit",
    Overlapped = "overlapped",
    Ignore = "ignore"
}

export async function runCommand(command: string, options: Parameters<typeof exec>[1] = {}, { printWhile = false, stdio = Stdio.Pipe, onData }: {detailedError?: boolean, printWhile?: boolean, stdio?: Stdio, onData?: (data: string, childProcess: ChildProcess) => void } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        if((command.includes("nvm") || command.includes("mise")) && fs.existsSync('/bin/zsh') && fs.existsSync(`${os.homedir()}/.zshrc`)) {
            process.env.PREFIX = "";
            command = `source ~/.zshrc > /dev/null 2>&1 || true && ${command}`
        }

        let output = ""
        
        const execRes = childProcess.spawn(command, [], {
            stdio,
            cwd: process.cwd(),
            shell: fs.existsSync('/bin/zsh') ? '/bin/zsh' : '/bin/sh',
            env: process.env,
            maxBuffer: 1024 * 1024 * 1024,
            ...options
        });
        
        execRes.stderr?.on('data', (data) => {
            output += data.toString();

            if(printWhile)  {
                console.log(data.toString());
            }

            if(onData) {
                onData(data.toString(), execRes);
            }
        });
        
        execRes.stdout?.on('data', (data) => {
            output += data.toString();

            if(printWhile) {
                console.log(data.toString());
            }

            if(onData) {    
                onData(data.toString(), execRes);
            }
        });

        execRes.on('close', function (code) {
            if(code == 0) {
                resolve(output);
            } else {
                reject(new Error(`Command exited with code ${code}`));
            }
        });
    });
}
