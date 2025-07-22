export class Logger {
    private _detailedLogOptions: boolean | undefined;

    constructor(detailedLogOptions: boolean | undefined) {
        this._detailedLogOptions = detailedLogOptions;
    }

    info(message: string, isMandatory: boolean) {
        if (!this._detailedLogOptions || isMandatory) {
            console.log(message);
        }
    }

    error(message: string) {
        console.log(`!!!Playwright-Cleanup warning: ${message}`);
    }
}
