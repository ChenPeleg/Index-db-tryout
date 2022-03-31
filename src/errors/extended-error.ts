


export class ExtendedError extends Error {
    public info?;
    constructor(orgError: Error, options?: { message?: string, info?: any, preMessage?: string, postMessage?: string }) {
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
        this.message = finalMessage
        Object.setPrototypeOf(this, orgError);

    }
}