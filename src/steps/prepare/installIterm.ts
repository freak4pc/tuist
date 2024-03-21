import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasFile } from "lib/utils/checks";

export class InstallIterm extends Step {
  async installCheck() {
    if (!hasFile("/Applications/iTerm.app")) {
      return {
        valid: false,
        reason: "Iterm is not installed at /Applications/iTerm.app",
      };
    }
    try {
      await runCommand("echo cool", { shell: "/bin/zsh" });
    } catch (e) {
      return { valid: false, reason: "Can't run using zsh" };
    }
    return {
      valid: true,
      reason: "Already installed iTerm and able to run zsh file",
    };
  }

  name() {
    return "Install Iterm";
  }

  async installStep() {
    await runCommand("brew install --force iterm2");
  }
}
