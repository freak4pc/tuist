export abstract class Step {
    async beforeInstallCheck() {
        return this.installCheck();
    }

    async afterInstallCheck() {
        return this.installCheck();
    }

    async install(): Promise<{success: boolean, reason?: string, error?: Error}> {
        try {
            await this.installStep();
        } catch(e: any) {
            return { success: false, error: e, reason: "Error during installation" }
        }
        const isInstalledNow = await this.afterInstallCheck();
        return { success: isInstalledNow.valid, reason: isInstalledNow.reason};
    }

    async checkPreinstall(): Promise<{valid: boolean, reason?: string, fixAction?: () => Promise<void> }> {
        return { valid: true, reason: "Can install" };
    }
    
    abstract installCheck(): Promise<{valid: boolean, reason?: string }>;
    abstract installStep(): Promise<void>;
    abstract name(): string;
}