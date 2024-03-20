import fs from "fs";
import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { pressAnyKeyToContinue, yesOrNo } from "lib/utils/question";
import { open } from "openurl";

export class GithubAuth extends Step {
  async installCheck() {
    try {
      const authResult = await runCommand("gh auth token");
      if (authResult.trim() === "") {
        return { valid: false, reason: "Github auth token is not set" };
      }
    } catch (e: any) {
      if (e.message.includes("no oauth token found")) {
        return { valid: false, reason: "Github auth token is not set" };
      }
    }

    if (!fs.existsSync(`${process.env.HOME}/.ssh`)) {
      return { valid: false, reason: "No ssh key folder" };
    }
    const sshFiles = await runCommand(`ls ${process.env.HOME}/.ssh`);
    if (!sshFiles.includes("id_")) {
      return { valid: false, reason: `No ssh id file found ${sshFiles}` };
    }

    try {
      await runCommand(
        "source ~/.zshrc > /dev/null 2>&1 || true && ssh -T git@github.com",
        {},
        { detailedError: false }
      );
    } catch (e: any) {
      if (e.message.includes("Permission denied")) {
        return { valid: false, reason: "SSH key is incorrect" };
      }
    }

    return { valid: true, reason: "already have a gh auth token" };
  }

  name() {
    return "Github Auth";
  }

  async installStep() {
    const setupEmail = await yesOrNo(
      "Did you already setup a github user in github.com settings and connected it to your email?"
    );
    if (!setupEmail) {
      console.log(
        "Add your @monday.com email in GitHub settings, define it in Emails section first and verify it."
      );
      console.log("Press any key to open github settings");
      await pressAnyKeyToContinue();
      open("https://github.com/settings/emails");
    }
    console.log("Let's login to github...");
    await runCommand(
      "source ~/.zshrc > /dev/null 2>&1 || true && gh auth login --git-protocol ssh --web --hostname github.com",
      {},
      {
        async onData(data, childProcess) {
          childProcess.stdin?.write("\n");
          childProcess.stdin?.end();
          if (data.includes("https://github.com/login/device")) {
            const code = /code: ([0-9A-Z\-]+)/.exec(data);
            console.log(
              `Copy the code ${code?.[0]} and press any key to complete login...`
            );
            await pressAnyKeyToContinue();
            open("https://github.com/login/device");
          }
        },
      }
    );
  }
}
