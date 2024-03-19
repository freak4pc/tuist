import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasEnvSet } from "lib/utils/checks";

export class PythonFixes extends Step {
  async installCheck() {
    if (!(await hasEnvSet("PYENV_ROOT"))) {
      return { valid: false, reason: "PYENV_ROOT is not set" };
    }
    if (!(await hasEnvSet("PYTHON"))) {
      return { valid: false, reason: "PYTHON is not set" };
    }
    const installedVersions = (await runCommand(`pyenv versions`)).trim();
    if (!installedVersions.includes("3.10.13")) {
      return { valid: false, reason: "3.10.13 is not installed" };
    }
    if (!installedVersions.includes("2.7.18")) {
      return { valid: false, reason: "2.7.18 is not installed" };
    }
    return {
      valid: true,
      reason:
        "Already have 3.10.13 & 2.7.18 version. env PYTHON was already set",
    };
  }

  name() {
    return "Python Fixes";
  }

  async installStep() {
    console.log("install python fixes!");

    const installedVersions = (await runCommand(`pyenv versions`)).trim();

    if (!installedVersions.includes("3.10.13")) {
      console.log("installing python 3.10.13");
      await runCommand(`arch -x86_64 pyenv install 3.10.13`);
    }

    if (!installedVersions.includes("2.7.18")) {
      console.log("installing python 2.7.18");
      await runCommand(`arch -x86_64 pyenv install 2.7.18`);
    }

    console.log("setting PYENV_ROOT");
    await runCommand(`echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc`);
    console.log("set to current shell");
    await runCommand(`export PYENV_ROOT="$HOME/.pyenv"`);

    console.log("adding pyenv to path");
    await runCommand(
      `echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc`
    );
    console.log("initializing pyenv");
    await runCommand(`echo 'eval "$(pyenv init -)"' >> ~/.zshrc`);
    console.log("setting global python version");
    await runCommand(`echo "pyenv global 2.7.18" >> ~/.zshrc`);
    console.log("setting env PYTHON");
    await runCommand(`echo "export PYTHON=python" >> ~/.zshrc`);
  }
}
