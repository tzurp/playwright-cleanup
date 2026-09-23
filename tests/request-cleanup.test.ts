import { createServer, type Server } from "node:http";
import { test as base, expect } from "@playwright/test";
import extendPlaywrightCleanup, { type CleanupOptions, type PlaywrightCleanup } from "../app";

let cleanupRequestSucceeded = false;

type WorkerFixtures = {
  serverUrl: string;
};

const test = base.extend<CleanupOptions & PlaywrightCleanup, WorkerFixtures>({
  serverUrl: [async ({}, use) => {
    const server: Server = createServer((request, response) => {
      if (request.url === "/cleanup") {
        response.statusCode = 204;
        response.end();
        return;
      }

      response.statusCode = 404;
      response.end();
    });

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("The test server did not expose a TCP address.");
    }

    try {
      await use(`http://127.0.0.1:${address.port}`);
    }
    finally {
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  }, { scope: "worker" }],
  ...extendPlaywrightCleanup({ dependOnRequest: true }),
});

test.describe.configure({ mode: "serial" });

test.afterAll(() => {
  expect(cleanupRequestSucceeded).toBe(true);
});

test("keeps request alive for fixture teardown cleanup", async ({ request, serverUrl, cleanup }) => {
  cleanup.addCleanup(async () => {
    const response = await request.get(`${serverUrl}/cleanup`);
    cleanupRequestSucceeded = response.status() === 204;
  });
});

test("finalize is idempotent", async ({ cleanup }) => {
  let executions = 0;
  cleanup.addCleanup(() => {
    executions += 1;
  });

  await cleanup.finalize();
  await cleanup.finalize();

  expect(executions).toBe(1);
  expect(cleanup.isFinalized).toBe(true);
});
