import { test as base } from "@playwright/test";
import { Cleanup } from "../entities/cleanup";

const test = base.extend<{ cleanup: Cleanup }>({
    cleanup: async({}, use) => {
        const cleanup = new Cleanup();

        await use(cleanup);

        await cleanup.finalize();
    }
});

export default test;

export const expect = test.expect;