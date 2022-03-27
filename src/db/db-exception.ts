export class Exception {
    constructor(error?: string | any, m?: string) {
        this.exception = error;
        if (m && typeof m === 'string') {
            this.message = m;
        } else if (error && typeof error === 'string') {
            this.message = error;
        }
        if (!this.exception) {
            this.exception = 'unknown exception'
        }
    }
    public isError = true;
    public message: string = 'unknown error';
    public exception: any = '';

}