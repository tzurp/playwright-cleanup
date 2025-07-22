import { Cleanup } from "../entities/cleanup";
import { Options } from "../entities/options";

const _playwrightCleanup = {
    cleanup: async({cleanupOptions}: any, use: (arg0: Cleanup) => any) => {
        const cleanup = new Cleanup(cleanupOptions);

        await use(cleanup);

        await cleanup.finalize();
    }
};

export const playwrightCleanup = _playwrightCleanup;
export type PlaywrightCleanup = { cleanup: Cleanup };
export type CleanupOptions = Options;