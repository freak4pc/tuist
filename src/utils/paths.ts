import os from "os";

export function getPath(p: string) {
    return p.replace('~', os.homedir());
}

export function getDevelopmentPath() {
    if (process.env.MONDAY_PATH) {
        return getPath(process.env.MONDAY_PATH);
    }

    return getPath("~/Development");
}