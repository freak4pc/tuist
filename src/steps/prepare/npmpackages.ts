import { runCommand } from "lib/utils/exec";
import { Step } from "../step";
import { pressAnyKeyToContinue } from "lib/utils/question";
import { open } from "openurl";
import { defaultNpmVersion } from "./nvm";

export class InstallNpmPackages extends Step {
  packages: string[];
  constructor(packages: string[]) {
    super();
    this.packages = packages;
  }

  async checkPreinstall(): Promise<{
    valid: boolean;
    reason?: string;
    fixAction?: () => Promise<void>;
  }> {
    const mndyPackages = this.packages.filter((pkg) =>
      pkg.includes("@mondaydotcom")
    );
    if (mndyPackages.length > 0) {
      for (const pkg of mndyPackages) {
        try {
          await runCommand(
            `nvm use ${defaultNpmVersion} && npm view ${pkg}`,
            {},
            { detailedError: false }
          );
        } catch (e: any) {
          if (
            e.message.includes("code E404") ||
            e.message.includes("code E403")
          ) {
            return {
              valid: false,
              reason: `You don't have access to install ${pkg}. ${e.message}`,
              fixAction: async () => {
                console.log(
                  "Press any key to open the form to request access to install the package."
                );
                await pressAnyKeyToContinue();
                open(
                  "https://forms.monday.com/forms/913463924b1367c3ec3c952c5985a5b9?r=use1"
                );
              },
            };
          }
        }
      }
    }
    return { valid: true, reason: "Can install" };
  }

  name() {
    return `Install Npm Packages ${this.packages.join(", ")}`;
  }

  async installCheck() {
    for (const pkg of this.packages) {
      try {
        const hasPkg = await runCommand(
          `nvm use ${defaultNpmVersion} && npm list -g ${pkg}`,
          {},
          { detailedError: false }
        );
        if (!hasPkg.includes(pkg)) {
          return { valid: false, reason: `${pkg} is not installed` };
        }
      } catch (e: any) {
        return {
          valid: false,
          reason: `${pkg} has error while checked. ${e.message}`,
        };
      }
    }
    return { valid: true, reason: "Already installed npm packages" };
  }

  async installStep() {
    console.log(`install npm packages! ${this.packages.join(", ")}`);
    await runCommand(
      `nvm use ${defaultNpmVersion} && npm install -g ${this.packages.join(
        " "
      )}`
    );
  }
}
