# playwright-cleanup

This plugin for [Playwright](https://playwright.dev/) helps simplify test cleanup. It does so by providing a systematic way to mark entities for deletion immediately after creation. This is particularly useful when tests involve creating complex structures, such as a bank account with an investment plan and a deposit. Without proper cleanup, attempting to delete the account may result in errors, such as a refusal due to the account not being empty. However, with <b>playwright-cleanup</b>, entities are deleted in the correct order, ensuring that tests clean up after themselves and do not interfere with each other. Read more [here](https://www.linkedin.com/pulse/test-automation-cleanup-advanced-plugin-playwright-tzur-paldi-phd/?trackingId=8R68dOtBSHKrCH0cNAviIA%3D%3D).

<h2>Installation</h2>

The easiest way to install this module as a (dev-)dependency is by using the following command:

```
npm install playwright-cleanup --save-dev
```

<h2>Usage</h2>

Import playwright-cleanup in your test file as follows:

```
import type { PlaywrightCleanup, DetailedLogOptions } from "playwright-cleanup";
import { playwrightCleanup } from "playwright-cleanup";
```

<h2>Usage in test</h2>

To use playwright-cleanup, simply import the playwright-cleanup object and types, and then extend your test object using test.extend(). This will include the cleanup functionality in your test. No further setup is required. Here's an example:

```
import base from "@playwright/test";
import type { PlaywrightCleanup, DetailedLogOptions } from "playwright-cleanup";
import { playwrightCleanup } from "playwright-cleanup";

const test = base.extend< PlaywrightCleanup & DetailedLogOptions>({
  detailedLogOptions: [false, {option: true}],
  cleanup: playwrightCleanup.cleanup,
});

test("should keep things tidy", async ({ page, cleanup}) =>
            // ...

            const accountId = createAccount("John Blow");
            
            cleanup.addCleanup(async () => await deleteAccount(accountId)); // TODO: here we mark it for deletion * 

            addInvestmentPlan(accountId, "ModRisk");

            cleanup.addCleanup(async () => await removeInvestmentPlan(accountId));
            
            deposit(accountId, 1000000);

            cleanup.addCleanup(async () => await removeDeposit(accountId));

            //...
        });

        // TODO: * Please note that the actual execution of the cleanup code would take palce AFTER test completion.
        // TODO: Execution order would be removeDeposit(accountId) -> removeInvestmentPlan(accountId) -> deleteAccount(accountId).
```

That's all there is to it! The cleanup functionality will now be automatically included in your tests.

<h2>Options</h2>

To get detailed terminal logs of the plugin, change the `detailedLogOptions` value inside test.extend() to `true` (without the ** **):

```
detailedLogOptions: [**true**, {option: true}]
```

<h2>Typescript support</h2>

Typescript is supported for this plugin.

<h2>Support</h2>

For any questions or suggestions contact me at: [tzur.paldi@outlook.com](mailto:tzur.paldi@outlook.com?subjet=Playwright-cleanup%20Support)