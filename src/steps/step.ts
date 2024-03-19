import { runCommand } from "lib/utils/exec";

export abstract class Step {
  async install(): Promise<{
    success: boolean;
    reason?: string;
    error?: Error;
  }> {
    try {
      // reload env variables
      await runCommand(`source ~/.zshrc > /dev/null 2>&1 || true`);
      await this.installStep();
    } catch (e: any) {
      return {
        success: false,
        error: e,
        reason: `Error during installation. Error: ${e.message}`,
      };
    }
    const isInstalledNow = await this.installCheck();
    return { success: isInstalledNow.valid, reason: isInstalledNow.reason };
  }

  async checkIfCanInstall(): Promise<{
    valid: boolean;
    reason?: string;
    fixAction?: () => Promise<void>;
  }> {
    try {
      const isInstalledNow = await this.checkPreinstall();
      return isInstalledNow;
    } catch (e: any) {
      return {
        valid: false,
        reason: `Error during check. Error: ${e.message}`,
      };
    }
  }

  async checkPreinstall(): Promise<{
    valid: boolean;
    reason?: string;
    fixAction?: () => Promise<void>;
  }> {
    return { valid: true, reason: "Can install" };
  }

  async checkIfShouldInstall(): Promise<{
    valid: boolean;
    reason?: string;
    fixAction?: () => Promise<void>;
  }> {
    try {
      const isInstalledNow = await this.installCheck();
      return isInstalledNow;
    } catch (e: any) {
      return {
        valid: false,
        reason: `Error during check. Error: ${e.message}`,
      };
    }
  }

  abstract installCheck(): Promise<{ valid: boolean; reason?: string }>;
  abstract installStep(): Promise<void>;
  abstract name(): string;
}
