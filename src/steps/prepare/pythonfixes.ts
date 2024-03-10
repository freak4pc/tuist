import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { hasEnvSet } from "lib/utils/checks";

export class PythonFixes extends Step {
    async installCheck() {
        if(!await hasEnvSet("PYENV_ROOT")) {
            return { valid: false, reason: "PYENV_ROOT is not set" };
        }
        if(!await hasEnvSet("PYTHON")) {
            return { valid: false, reason: "PYTHON is not set" };
        }
        const installedVersions = (await runCommand(`pyenv versions`)).trim();
        if(!installedVersions.includes("3.10.13")) {
            return { valid: false, reason: "3.10.13 is not installed" };
        }
        if(!installedVersions.includes("2.7.18")) {
            return { valid: false, reason: "2.7.18 is not installed" };
        }    
        return { valid: true, reason: "Already have 3.10.13 & 2.7.18 version. env PYTHON was already set" };
    }

    name() {
        return "Python Fixes";
    }

    async installStep() {
        await runCommand(`pyenv install 3.10.13`);
        await runCommand(`pyenv install 2.7.18`);
        await runCommand(`echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc`);
        await runCommand(`echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc`);
        await runCommand(`echo 'eval "$(pyenv init -)"' >> ~/.zshrc`);
        await runCommand(`echo "pyenv global 2.7.18" >> ~/.zshrc`);
        await runCommand(`echo "export PYTHON=python" >> ~/.zshrc`);
    }
}