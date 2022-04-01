export interface ExtendedErrorOptions { message?: string, info?: any, preMessage?: string, postMessage?: string }


export class ExtendedError extends Error {
    public info?;
    constructor(orgError: Error, options?: ExtendedErrorOptions) {
        super(orgError.message);
        this.stack = orgError.stack;
        this.name = orgError.name;
        let finalMessage = this.message;
        if (options) {
            if (options.message) {
                finalMessage = options.message;
            }
            if (options.postMessage) {
                finalMessage += options.postMessage;
            }
            if (options.preMessage) {
                finalMessage = options.preMessage + finalMessage;
            }
            if (options.info) {
                this.info = options.info
            }
        }
        this.message = finalMessage;
        if (finalMessage !== orgError.message) {
            this.stack = orgError.stack?.replace(orgError.message, finalMessage);
        }
        Object.setPrototypeOf(this, orgError);

    }
}