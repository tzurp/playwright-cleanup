import { Cleanup } from "../entities/cleanup";

const _cleanupTotal = {
    cleanup: async({detailedLogOptions}: any, use: (arg0: Cleanup) => any) => {
        const cleanup = new Cleanup(detailedLogOptions);

        await use(cleanup);

        await cleanup.finalize();
    }
};

export const cleanupTotal = _cleanupTotal;
export type CleanupTotal = { cleanup: Cleanup };
export type DetailedLogOptions = {detailedLogOptions: boolean};