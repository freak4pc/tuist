import { runCommand } from "./exec";

export async function getName() {
  const fullName = (await runCommand("id -F")).trim();
  return {
    fullName,
    name: fullName.split(" ")[0],
  };
}

export async function getDevice() {
  return (await runCommand("sysctl -n machdep.cpu.brand_string")).trim();
}
