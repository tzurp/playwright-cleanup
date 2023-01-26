import base, { expect } from "@playwright/test";
import type { CleanupTotal, DetailedLogOptions } from "../app";
import { cleanupTotal } from "../app";

const test = base.extend< CleanupTotal & DetailedLogOptions>({
  detailedLogOptions: [false, {option: true}],
  cleanup: cleanupTotal.cleanup,
});

test('test1', async ({ page, cleanup}) => {
  await page.goto('https://playwright.dev/');

  cleanup.addCleanup(() => console.log("Cleaning playwright stage 1"));

  cleanup.addCleanup(() => {throw new Error(); console.log("Cleaning playwright stage 2")});

  cleanup.addCleanup(() => console.log("Cleaning playwright stage 3"));

  cleanup.addCleanup(async () => console.log("Title playwright = " + await page.title()));

  expect(5).toBe(5);
});

test('test2', async ({ page, cleanup: cleanup }) => {
  await page.goto('http://www.konaworld.com');

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 1"));

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 2"));

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 3"));

  cleanup.addCleanup(async () => console.log("Title Kona = " + await page.title()));
});
