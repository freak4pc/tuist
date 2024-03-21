import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasCommand } from "lib/utils/checks";

export class RvmInstaller extends Step {
  async installCheck() {
    if (!(await hasCommand("rvm --version"))) {
      return {
        valid: false,
        reason: "RVM is not installed. Command rvm not found.",
      };
    }
    return { valid: true };
  }
  name() {
    return "Install RVM";
  }
  async installStep() {
    console.log("installing RVM");
    await runCommand("curl -sSL https://get.rvm.io | bash -s stable");
    await runCommand('source "$HOME/.rvm/scripts/rvm"');
  }
}
