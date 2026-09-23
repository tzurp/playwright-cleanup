# playwright-cleanup

This plugin for [Playwright](https://playwright.dev/) helps simplify test cleanup. It does so by providing a systematic way to mark entities for deletion immediately after creation. This is particularly useful when tests involve creating complex structures, such as a bank account with an investment plan and a deposit. Without proper cleanup, attempting to delete the account may result in errors, such as a refusal due to the account not being empty. However, with <b>playwright-cleanup</b>, entities are deleted in the correct order, ensuring that tests clean up after themselves and do not interfere with each other. Read more [here](https://www.linkedin.com/pulse/test-automation-cleanup-advanced-plugin-playwright-tzur-paldi-phd/?trackingId=8R68dOtBSHKrCH0cNAviIA%3D%3D).

## Installation

The easiest way to install this module as a (dev-)dependency is by using the following command:

```
npm install playwright-cleanup --save-dev
```

## Major Update: Version 2.x.x

> ### ❗❗❗Breaking Changes❗❗❗
> 
> This release includes significant changes that may affect your existing implementations. Please read the following instructions carefully to ensure a smooth transition.
> 
> ### Import and Extending Playwright Test
> 
> We have simplified the way you import and extend the Playwright `test` in this version. Make sure to follow these new instructions to properly set up your tests.

## Usage

Import the runtime module in your test file as follows:

```typescript
import extendPlaywrightCleanup from "playwright-cleanup";
```

For TypeScript, add the fixture and option types separately:

```typescript
import type { PlaywrightCleanup, CleanupOptions } from "playwright-cleanup";
```

For JavaScript, you can skip the type import entirely.

## Usage in test

To use playwright-cleanup, extend your Playwright `test` object with the cleanup fixture. This adds the `cleanup` helper to your tests with no extra setup.

```typescript
// test.ts
import base from "@playwright/test";
import extendPlaywrightCleanup from "playwright-cleanup";
import type { PlaywrightCleanup, CleanupOptions } from "playwright-cleanup";

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup());
```

For JavaScript, the same setup works without the type import:

```javascript
// test.js
import base from "@playwright/test";
import extendPlaywrightCleanup from "playwright-cleanup";

const test = base.extend(extendPlaywrightCleanup());
```

Example usage:

```typescript
test("should keep things tidy", async ({ page, cleanup}) => {
            // ...

            const accountId = createAccount("John Blow");
            
            cleanup.addCleanup(async () => await deleteAccount(accountId)); // TODO: here we mark it for deletion * 

            addInvestmentPlan(accountId, "ModRisk");

            cleanup.addCleanup(async () => await removeInvestmentPlan(accountId));
            
            deposit(accountId, 1000000);

            cleanup.addCleanup(async () => await removeDeposit(accountId));

            //...
        });

        // * Please note that the actual execution of the cleanup code occurs after test completion.
        // * Execution order: removeDeposit(accountId) -> removeInvestmentPlan(accountId) -> deleteAccount(accountId).
```

That's all there is to it! The cleanup functionality will now be automatically included in your tests.

* The recommended approach is to place the extended test object in its own shared module (e.g., a dedicated setup or fixtures file), allowing all test files to import and use the same extended configuration.

## Options

### suppressLogging

By default, the plugin writes detailed logging to the terminal. To suppress these logs, set the `suppressLogging` option to `true` and pass the option object as a parameter to `extendPlaywrightCleanup`:

```typescript
import type { CleanupOptions, PlaywrightCleanup } from "playwright-cleanup";

const options: CleanupOptions = {
  suppressLogging: true,
};

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup(options));
```

### dependOnRequest

If a cleanup callback closes over Playwright's test-scoped `request` fixture, opt into making `request` a dependency of the cleanup fixture:

```typescript
const options: CleanupOptions = {
  dependOnRequest: true,
};

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup(options));
```

With this option, Playwright keeps `request` alive until cleanup callbacks have finished. The callback still closes over the same `request` fixture used by the test:

```typescript
test("creates an entity", async ({ request, cleanup }) => {
  const response = await request.post("/entities");
  const entity = await response.json();

  cleanup.addCleanup(async () => {
    await request.delete(`/entities/${entity.id}`);
  });
});
```

The option is disabled by default, so existing version-2 teardown behavior is unchanged. It only coordinates the `request` fixture. `page.request` is a different API and is closed with its browser context; `page`, `context`, and custom fixtures are not implicit cleanup dependencies. A custom fixture that depends on `cleanup`, while cleanup also depends on that fixture, creates a Playwright fixture cycle.

Cleanup callbacks run in reverse registration order. Callback failures are logged as warnings and do not fail the test.

## Typescript support

Typescript is supported for this plugin.

## Support

For any questions or suggestions contact me at: [tzur.paldi@outlook.com](mailto:tzur.paldi@outlook.com?subjet=Playwright-cleanup%20Support)

📬 Maintained by [Tzur Paldi](https://github.com/tzurp) — explore my GitHub profile for more tools.
