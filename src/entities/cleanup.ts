import { Logger } from "./logger";

export class Cleanup {
    private _detailedLogOptions: boolean;
    private _cleanupList: Array<Function>;

    constructor(detailedLogOptions: boolean) {
        this._detailedLogOptions = detailedLogOptions;
        this._cleanupList = new Array<Function>();;
    }

    /**
     * 
     * @param cleanupFunction Insert a cleanup function to the cleanup stack.
     */
    addCleanup(cleanupFunction: Function): void {
        this._cleanupList.push(cleanupFunction);
    }

    /**
     * @deprecated Don't use this method directly.
     */
    async finalize(): Promise<void> {
        if (this._cleanupList.length <= 0) {
            return;
        }

        const errors = [];

        const logger = new Logger(this._detailedLogOptions);

        const processId = process.pid;

        logger.printToLog(`Playwright-cleanup [${processId}]: ### Cleanup initialized ###`, false);

        this._cleanupList.reverse();

        for (let i = 0; i < this._cleanupList.length; i++) {
            try {
                await this._cleanupList[i]();

                const message = `Playwright-cleanup [🙂 ${processId}]: Successfully executed '${this._cleanupList[i].toString()}'`;

                logger.printToLog(message, false);
            }
            catch (err: any) {
                const message = `Playwright-cleanup [😕 ${processId}]: Failed to execute '${this._cleanupList[i].toString()}': ${err.message}, ${err.stack}`;

                errors.push(message);
            }
        }

        if (errors.length > 0) {
            logger.printToLog(`Playwright-cleanup: Warning!!!: Cleanup for [${processId}] finished with ${errors.length} error(s):`, true);

            errors.forEach(error => {
                logger.printToLog(error, true);
            });
        }

        this._cleanupList.length = 0;

        logger.printToLog(`Playwright-cleanup [${processId}]: ### Cleanup done ###`, false);
    }
}
