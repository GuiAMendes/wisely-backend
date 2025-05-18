// Class
import { ApplicationError } from "../../shared/error/ApplicationError";

export class EntityNotFoundError extends ApplicationError {
  constructor(message = "Entity not found") {
    super(message, 404);
    this.name = "EntityNotFoundError";
  }
}
