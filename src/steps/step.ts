export abstract class Step {
    async install(): Promise<{success: boolean, reason?: string, error?: Error}> {
        try {
            await this.installStep();
        } catch(e: any) {
            return { success: false, error: e, reason: `Error during installation. Error: ${e.message}` }
        }
        const isInstalledNow = await this.installCheck();
        return { success: isInstalledNow.valid, reason: isInstalledNow.reason};
    }

    async checkPreinstall(): Promise<{valid: boolean, reason?: string, fixAction?: () => Promise<void> }> {
        return { valid: true, reason: "Can install" };
    }

    abstract installCheck(): Promise<{valid: boolean, reason?: string }>;
    abstract installStep(): Promise<void>;
    abstract name(): string;
}