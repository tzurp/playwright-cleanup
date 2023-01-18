export class Cleanup {
    private _errorCount: number;
    private _cleanupList: Array<Function>;

    constructor() {
        this._cleanupList = new Array<Function>();;
        this._errorCount = 0;
    }

    // /**
    //  * @deprecated Don't use this method if *wdio-cleanuptotal-service* is enabled.
    //  */
    // protected initialize() {
    //     this._cleanupList = new Array<Function>();
    //     this._errorCount = 0;
    // }

    /**
     * 
     * @param cleanupFunction Insert a cleanup function to the cleanup stack.
     */
    addCleanup(cleanupFunction: Function): void {
        this._cleanupList.push(cleanupFunction);
    }

    /**
     * @deprecated Don't use this method if *wdio-cleanuptotal-service* is enabled.
     */
    async finalize(): Promise<void> {
        if (this._cleanupList.length <= 0) {
            return;
        }

        const processId = process.pid;

        console.log(`CleanupTotal [${processId}]: ##### Cleanup initialized #####`);

        this._cleanupList.reverse();

        for (let i = 0; i < this._cleanupList.length; i++) {
            try {
                await this._cleanupList[i]();

                const message = `CleanupTotal [🙂 ${processId}]: Successfully executed '${this._cleanupList[i].toString()}'`;

                console.log(message);
            }
            catch (ex) {
                this._errorCount++;

                const message = `CleanupTotal [😕 ${processId}]: Failed to execute '${this._cleanupList[i].toString()}: ${ex}'`;

                console.log(message);
            }
        }

        this._cleanupList.length = 0;

        if (this._errorCount > 0) {
            console.log;(`CleanupTotal: Warning!!!: Cleanup for [${processId}] finished with ${this._errorCount} errors`);
        }

        console.log(`CleanupTotal [${processId}]: ### Cleanup done ###`);
    }
}
