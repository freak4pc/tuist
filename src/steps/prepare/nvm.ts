import fs from "fs";
import os from "os";
import { Step } from "../step";
import { runCommand } from "lib/utils/exec";
import { hasCommand, hasEnvSet, hasFile } from "lib/utils/checks";

export const defaultNpmVersion = "16.14";

export class InstallNvm extends Step {
  constructor() {
    super();
  }
  async installCheck() {
    if (!(await hasEnvSet("NVM_DIR"))) {
      return { valid: false, reason: "Nvm is not installed. No $NVM_DIR" };
    }

    if (!hasFile(`~/.nvm`)) {
      return { valid: false, reason: "Nvm is not installed. No ~/.nvm" };
    }

    if (!(await hasCommand("nvm --version"))) {
      return {
        valid: false,
        reason: "Nvm is not installed. command not found",
      };
    }

    let list = "";
    try {
      list = await runCommand("nvm list", {}, { detailedError: false });
    } catch (e: any) {
      if (e.message.includes("N/A")) {
        return {
          valid: false,
          reason: "Nvm is not installed. No installed node versions",
        };
      }
      return { valid: false, reason: `Nvm error ${e.message}` };
    }

    if (!list.includes(`v${defaultNpmVersion}`)) {
      return {
        valid: false,
        reason: `Node ${defaultNpmVersion} is not installed`,
      };
    }

    if (!list.includes("v18.12")) {
      return { valid: false, reason: "Node 18.12 is not installed" };
    }

    if (!list.includes("v18.19")) {
      return { valid: false, reason: "Node 18.19 is not installed" };
    }

    return {
      valid: true,
      reason: `Already installed nvm && node ${defaultNpmVersion}`,
    };
  }

  name() {
    return "Install nvm";
  }

  async installStep() {
    console.log("Installing nvm");
    await runCommand(
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    );

    console.log("Adding nvm to shell");
    await runCommand(
      'echo "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh  # This loads NVM" >> ~/.zshrc'
    );

    console.log("Sourcing nvm HOME");
    await runCommand(". $HOME/.nvm/nvm.sh");

    console.log("brewing nvm");
    await runCommand("brew install nvm");

    console.log("Sourcing nvm");
    await runCommand("source $(brew --prefix nvm)/nvm.sh");

    console.log("Installing node 16.14");
    await runCommand("nvm install 16.14");

    console.log("Installing node 18.12");
    await runCommand("nvm install 18.12");

    console.log("Installing node 18.19");
    await runCommand("nvm install 18.19");

    console.log(`Setting node ${defaultNpmVersion} as default`);
    await runCommand(`nvm alias default ${defaultNpmVersion}`);
  }
}
