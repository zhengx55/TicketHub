import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode: number = 400;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError);
    }
    serializeErrors(): { message: string; field?: string | undefined; value?: string | undefined; }[] {
        return [{ message: this.message }]
    }
}