import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super("Unauthorized");
    Object.setPrototypeOf(this, UnauthorizedError);
  }
  serializeErrors(): {
    message: string;
    field?: string | undefined;
    value?: string | undefined;
  }[] {
    return [{ message: "Unauthorized" }];
  }
}
