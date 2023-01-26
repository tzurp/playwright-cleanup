export class Logger {
    private _detailedLogOptions: boolean;

    constructor(detailedLogOptions: boolean) {
        this._detailedLogOptions = detailedLogOptions;
    }

    printToLog(message: string, isMandatory: boolean) {
        if (this._detailedLogOptions || !this._detailedLogOptions && isMandatory) {
            console.log(message);
        }
    }
}
