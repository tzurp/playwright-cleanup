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

Import playwright-cleanup in your test file as follows:

```typescript
import extendPlaywrightCleanup, { PlaywrightCleanup, CleanupOptions } from "playwright-cleanup";
```

## Usage in test

To use playwright-cleanup, simply import the extendPlaywrightCleanup object and types, and then extend your test object using test.extend<>(). This will include the `cleanup` fixture functionality in your test. No further setup is required. Here's an example:

```typescript
import base from "@playwright/test";
import extendPlaywrightCleanup, { PlaywrightCleanup, CleanupOptions } from "playwright-cleanup";

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup());

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

* It is advisable to define the extended `test` object in a separate, reusable `test-base` file.

## Options

### suppressLogging

By default, the plugin writes detailed logging to the terminal. To suppress these logs, set the `suppressLogging` option to `true` and pass the option object as a parameter to `extendPlaywrightCleanup`:

```typescript
const options:CleanupOptions = {
  suppressLogging: true
}

const test = base.extend<CleanupOptions & PlaywrightCleanup>(extendPlaywrightCleanup(options));
```

## Typescript support

Typescript is supported for this plugin.

## Support

For any questions or suggestions contact me at: [tzur.paldi@outlook.com](mailto:tzur.paldi@outlook.com?subjet=Playwright-cleanup%20Support)