import { runCommand } from "./exec";

export async function getName() {
    const fullName = (await runCommand('id -F')).trim();
    return {
        fullName,
        name: fullName.split(' ')[0]
    } 
}