import fs from "fs";
import { Step } from "../step";
import { Stdio, runCommand } from "lib/utils/exec";
import { getPath } from "lib/utils/paths";
import { pressAnyKeyToContinue } from "lib/utils/question";
import { open } from "openurl";

export const GIT_CLONE_STEP = "gitclone";

export class GitClone extends Step {
  type() {
    return GIT_CLONE_STEP;
  }
  repo: string;
  destination: string;
  showOutput: boolean = false;
  constructor(repo: string, destination: string, showOutput: boolean = false) {
    super();
    this.repo = repo;
    this.destination = getPath(destination);
    this.showOutput = showOutput;
  }

  name() {
    return `Git clone ${this.repo} to ${this.destination}`;
  }

  async checkPreinstall() {
    try {
      await runCommand(
        `gh repo view ${this.repo}`,
        {},
        { detailedError: false }
      );
    } catch (e: any) {
      if (e.message.toLowerCase().includes("could not resolve")) {
        return {
          valid: false,
          reason: `No permissions to repo ${this.repo}`,
          fixAction: async () => {
            console.log(
              `Press any key to open the form to request access to repo ${this.repo}.`
            );
            await pressAnyKeyToContinue();
            open(
              "https://forms.monday.com/forms/913463924b1367c3ec3c952c5985a5b9?r=use1"
            );
          },
        };
      }
    }
    return { valid: true };
  }

  async installCheck() {
    if (!fs.existsSync(this.destination)) {
      return {
        valid: false,
        reason: `Folder ${this.destination} folder does not exist`,
      };
    }
    if (!fs.existsSync(`${this.destination}/.git`)) {
      return {
        valid: false,
        reason: `Folder ${this.destination} is not a git repo`,
      };
    }
    return { valid: true };
  }

  async installStep() {
    console.log(`Cloning Repo '${this.repo}' to ${this.destination}`);
    await runCommand(
      `source ~/.zshrc > /dev/null 2>&1 || true && gh repo clone org-Dapulse@github.com:${this.repo}.git ${this.destination}`,
      {},
      {
        stdio: this.showOutput ? Stdio.Inherit : Stdio.Ignore,
        onData: (data, childProcess) => {
          if (
            data
              .toLocaleLowerCase()
              .includes("are you sure you want to continue connecting")
          ) {
            childProcess.stdin?.write("yes\n");
            childProcess.stdin?.end();
          }
        },
      }
    );
  }
}
