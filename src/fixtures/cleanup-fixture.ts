import { Cleanup } from "../entities/cleanup";
import { Options } from "../entities/options";

type CleanupUse = (cleanup: Cleanup) => Promise<void>;

const cleanupFixture = async({cleanupOptions}: {cleanupOptions: Options}, use: CleanupUse) => {
    const cleanup = new Cleanup(cleanupOptions);

    await use(cleanup);

    await cleanup.finalize();
};

const cleanupFixtureWithRequest = async({cleanupOptions, request}: {cleanupOptions: Options, request: unknown}, use: CleanupUse) => {
    const cleanup = new Cleanup(cleanupOptions);

    await use(cleanup);

    await cleanup.finalize();
};

const _playwrightCleanup = {
    cleanup: cleanupFixture,
    cleanupWithRequest: cleanupFixtureWithRequest,
};

export const playwrightCleanup = _playwrightCleanup;
export type PlaywrightCleanup = { cleanup: Cleanup };
export type CleanupOptions = Options;