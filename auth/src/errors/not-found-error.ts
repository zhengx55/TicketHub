import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('Route not Found');
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    serializeErrors(): { message: string; field?: string | undefined; value?: string | undefined; }[] {
        return [{ message: 'Not Found' }]
    }
}