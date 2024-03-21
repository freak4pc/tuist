import { runCommand } from "lib/utils/exec";
import { Step } from "../step";

export class InstallPipPackages extends Step {
  packages: string[];
  constructor(packages: string[]) {
    super();
    this.packages = packages;
  }
  async installCheck() {
    for (const curpackage of this.packages) {
      const [packageName] = curpackage.split("==");
      try {
        const packageShown = await runCommand(`pip3 show ${packageName}`);
        if (!packageShown.includes("Name: " + packageName)) {
          console.log("package shown", packageName);
          return {
            valid: false,
            reason: `Package ${packageName} is not installed`,
          };
        }
      } catch (e: any) {
        return {
          valid: false,
          reason: `Package ${curpackage} failed to check. ${e.message}`,
        };
      }
    }
    return { valid: true, reason: "Already installed pip packages before" };
  }
  name() {
    return `Install Pip Packages ${this.packages.join(", ")}`;
  }
  async installStep() {
    console.log(`install pip packages! ${this.packages.join(", ")}`);
    await runCommand(`pip3 install ${this.packages.join(" ")}`);
  }
}
