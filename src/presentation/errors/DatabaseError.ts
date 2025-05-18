// Class
import { ApplicationError } from "../../shared/error/ApplicationError";

export class DatabaseError extends ApplicationError {
  constructor(message = "Database error") {
    super(message, 500);
    this.name = "DatabaseError";
  }
}
