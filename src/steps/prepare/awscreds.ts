import fs from "fs";
import os from "os";
import { Step } from "../step";
import { runCommand } from "lib/utils/exec";
import { hasFile } from "lib/utils/checks";

export class AwsCreds extends Step {
  async installCheck() {
    if (!hasFile(`~/.awscreds`)) {
      return { valid: false, reason: "AWS credentials are not set" };
    }
    if ((await runCommand(`stat -f %A ~/.awscreds`)).trim() !== "755") {
      return { valid: false, reason: "AWS credentials has wrong chmod" };
    }
    return { valid: true };
  }

  name() {
    return "Set AWS Credentials";
  }

  async installStep() {
    console.log("Create .awscreds file");
    await runCommand(`touch ~/.awscreds`);
    console.log("Fix permissions on .awscreds file");
    await runCommand(`chmod +x ~/.awscreds`);
  }
}
