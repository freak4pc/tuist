import fs from "fs";
import { runCommand } from "./exec";
import { getPath } from "./paths";

export async function hasCommand(command: string): Promise<boolean> {
  try {
    await runCommand(command, {}, { detailedError: false });
    return true;
  } catch (e: any) {
    if (e.message.toLowerCase().includes("command not found")) {
      return false;
    }
    if (e.message.toLowerCase().includes("can't find")) {
      return false;
    }
    return true;
  }
}

export async function hasEnvSetTo(
  env: string,
  expectedValue: string
): Promise<boolean> {
  const currentEnvValue = (
    await runCommand(`source ~/.zshrc > /dev/null 2>&1 || true && echo $${env}`)
  ).trim();
  return currentEnvValue === expectedValue;
}

export async function hasEnvSet(env: string): Promise<boolean> {
  const currentEnvValue = (
    await runCommand(`source ~/.zshrc > /dev/null 2>&1 || true && echo $${env}`)
  ).trim();
  return currentEnvValue !== "";
}

export function hasFile(file: string): boolean {
  return fs.existsSync(getPath(file));
}
