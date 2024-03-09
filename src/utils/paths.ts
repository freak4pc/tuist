import os from "os";

export function getPath(p: string) {
    return p.replace('~', os.homedir());
}