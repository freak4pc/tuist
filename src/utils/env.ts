import { runCommand } from "./exec";

export async function setEnv(key: string, value: string) {
    await runCommand(`echo "export ${key}=${value}" >> ~/.zshrc`);
}