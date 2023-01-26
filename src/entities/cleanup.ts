import { Logger } from "./logger";

export class Cleanup {
    private _detailedLogOptions: boolean;
    private _errorCount: number;
    private _cleanupList: Array<Function>;

    constructor(detailedLogOptions: boolean) {
        this._detailedLogOptions = detailedLogOptions;
        this._cleanupList = new Array<Function>();;
        this._errorCount = 0;
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

        const logger = new Logger(this._detailedLogOptions);

        const processId = process.pid;

        logger.printToLog(`CleanupTotal [${processId}]: ##### Cleanup initialized #####`, false);

        this._cleanupList.reverse();

        for (let i = 0; i < this._cleanupList.length; i++) {
            try {
                await this._cleanupList[i]();

                const message = `CleanupTotal [🙂 ${processId}]: Successfully executed '${this._cleanupList[i].toString()}'`;

                logger.printToLog(message, false);
            }
            catch (ex) {
                this._errorCount++;

                const message = `CleanupTotal [😕 ${processId}]: Failed to execute '${this._cleanupList[i].toString()}: ${ex}'`;

                logger.printToLog(message, true);
            }
        }

        this._cleanupList.length = 0;

        if (this._errorCount > 0) {
            logger.printToLog(`CleanupTotal: Warning!!!: Cleanup for [${processId}] finished with ${this._errorCount} error(s)`, true);
        }

        logger.printToLog(`CleanupTotal [${processId}]: ### Cleanup done ###`, false);
    }
}
