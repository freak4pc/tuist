import childProcess, { ChildProcess } from "child_process";
import util from "util";
import fs from "fs";
import os from "os";

const exec = util.promisify(childProcess.exec);

export async function runCommand(
  command: string,
  options: Parameters<typeof exec>[1] = {},
  {
    printWhile = false,
    detailedError = true,
    onData,
  }: {
    detailedError?: boolean;
    printWhile?: boolean;
    onData?: (data: string, childProcess: ChildProcess) => void;
  } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (
      command.includes("nvm") &&
      fs.existsSync("/bin/zsh") &&
      fs.existsSync(`${os.homedir()}/.zshrc`)
    ) {
      process.env.PREFIX = "";
      command = `source ~/.zshrc > /dev/null 2>&1 || true && ${command}`;
    }

    const execRes = childProcess.exec(
      command,
      {
        cwd: process.cwd(),
        shell: fs.existsSync("/bin/zsh") ? "/bin/zsh" : "/bin/sh",
        env: process.env,
        maxBuffer: 1024 * 1024 * 1024,
        ...options,
      },
      (error, stdout, stderr) => {
        if (error) {
          if (detailedError) {
            console.log("error occured", stdout, stderr, error);
          }

          reject(error);
        } else {
          resolve(stdout as string);
        }
      }
    );
    execRes.stderr?.on("data", (data) => {
      if (printWhile) {
        console.log(data.toString());
      }
      if (onData) {
        onData(data.toString(), execRes);
      }
    });
    execRes.stdout?.on("data", (data) => {
      if (printWhile) {
        console.log(data.toString());
      }
      if (onData) {
        onData(data.toString(), execRes);
      }
    });
  });
}
