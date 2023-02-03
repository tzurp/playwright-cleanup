# playwright-cleanup

This plugin for [Playwright](https://playwright.dev/) is used to properly cleanup after each test.
Cleanup after test might get complicated. For example: Lets say you are creating a bank account and then adding an investment plan and depositing there some money. If you try to delete the account you might probably get a refusion because the account is not empty. <b>playwright-cleanup</b> helps you to do it systematically by 'marking' each entity you create for deletion right after its creation. When the test is finished, <b>playwright-cleanup</b> would delete the investment plan, the deposit and the account in the right order.

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

You need to import <b>playwright-cleanup</b> object and types as described above, and then use test.extend() to create a new test object that will include it:

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
            
            cleanup.addCleanup(async () => { await deleteAccount(accountId) }); // TODO: here we mark it for deletion * 

            addInvestmentPlan(accountId, "ModRisk");

            cleanup.addCleanup(async () => { await removeInvestmentPlan(accountId) });
            
            deposit(accountId, 1000000);

            cleanup.addCleanup(async () => { await removeDeposit(accountId) });

            //...
        });

        // TODO: * Please note that the actual execution of the cleanup code would take palce AFTER test completion.
        // TODO: Execution order would be removeDeposit(accountId) -> removeInvestmentPlan(accountId) -> deleteAccount(accountId).
```

<h2>Options</h2>

To get detailed terminal logs of the plugins change the `detailedLogOptions` value inside test.extend() to `true`:

```
detailedLogOptions: [**true**, {option: true}]
```

<h2>Typescript support</h2>

Typescript is supported for this plugin.