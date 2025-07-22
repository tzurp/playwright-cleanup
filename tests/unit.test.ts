import {test as base, expect } from "@playwright/test";
import extendPlaywrightCleanup, { PlaywrightCleanup, CleanupOptions } from "../app";

const options:CleanupOptions = {
  suppressLogging: true
}

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup(options));

test('faulty cleanup', async ({ page, cleanup }) => {
  await page.goto('https://playwright.dev/');

  cleanup.addCleanup(() => console.log("Cleaning playwright stage 1"));

  cleanup.addCleanup(() => {
    const invalidJson = '{ "name": "John", "age": }';
    JSON.parse(invalidJson);
  });

  cleanup.addCleanup(() => { console.log("Cleaning playwright stage 3"); throw new Error("Intentional error") });

  cleanup.addCleanup(async () => console.log("Title playwright = " + await page.title()));

  expect(5).toBe(4 + 1);
});

test('successful cleanup', async ({ page, cleanup: cleanup }) => {
  await page.goto('http://www.konaworld.com');

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 1"));

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 2"));

  cleanup.addCleanup(() => console.log("Cleaning Kona stage 3"));

  cleanup.addCleanup(async () => console.log("Title Kona = " + await page.title()));
});
