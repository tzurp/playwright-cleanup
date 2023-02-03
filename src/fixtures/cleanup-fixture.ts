import { Cleanup } from "../entities/cleanup";

const _playwrightCleanup = {
    cleanup: async({detailedLogOptions}: any, use: (arg0: Cleanup) => any) => {
        const cleanup = new Cleanup(detailedLogOptions);

        await use(cleanup);

        await cleanup.finalize();
    }
};

export const playwrightCleanup = _playwrightCleanup;
export type PlaywrightCleanup = { cleanup: Cleanup };
export type DetailedLogOptions = {detailedLogOptions: boolean};