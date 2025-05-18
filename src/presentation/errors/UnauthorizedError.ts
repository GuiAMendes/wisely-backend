// Class
import { ApplicationError } from "../../shared/error/ApplicationError";

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}
