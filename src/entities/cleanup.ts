import { Logger } from "./logger";
import { Options } from "./options";

export class Cleanup {
    private _supressLogging: boolean|undefined;
    private _cleanupList: Array<Function>;

    constructor(options: Options) {
        this._supressLogging = options.suppressLogging;
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

        const logger = new Logger(this._supressLogging);

        const processId = process.pid;

        logger.info(`Playwright-cleanup [${processId}]: ### Cleanup initialized ###`, false);

        this._cleanupList.reverse();

        for (let i = 0; i < this._cleanupList.length; i++) {
            try {
                await this._cleanupList[i]();

                const message = `Playwright-cleanup [🙂 ${processId}]: Successfully executed '${this._cleanupList[i].toString()}'`;

                logger.info(message, false);
            }
            catch (err: any) {
                const message = `Playwright-cleanup [😕 ${processId}]: Failed to execute '${this._cleanupList[i].toString()}': ${err.message}, ${err.stack}`;

                errors.push(message);
            }
        }

        if (errors.length > 0) {
            logger.error(`Cleanup for [${processId}] finished with ${errors.length} error(s):`);

            errors.forEach(error => {
                logger.error(error);
            });
        }

        this._cleanupList.length = 0;

        logger.info(`Playwright-cleanup [${processId}]: ### Cleanup done ###`, false);
    }
}
