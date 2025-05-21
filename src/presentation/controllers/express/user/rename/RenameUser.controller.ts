// External libraries
import { Request, Response } from "express";

// Use case
import { RenameUserUseCase } from "../../../../../application/use-cases/user/rename/RenameUser.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./RenameUser.presenter";

// Validator
import { isSafe } from "../../../../../domain/validator/user";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class RenameUserController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameUserUseCase: RenameUserUseCase
  ) {}

  public static create(renameUserUseCase: RenameUserUseCase) {
    return new RenameUserController(
      "/user/:id/rename",
      "patch",
      renameUserUseCase
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { newUsername } = request.body;
      const { id: idUser } = request.params;

      const checkUser = isSafe(newUsername);

      if (!checkUser) {
        response
          .status(400)
          .json({ error: "The new username is invalid or ansafety." });
        return;
      }

      try {
        const updatedUser = await this.renameUserUseCase.execute({
          idUser,
          newUsername,
        });

        const output = presenter({
          idUser: updatedUser.idUser,
          newUsername: updatedUser.username,
        });

        response.status(200).json(output);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          response.status(401).json({ error: error.message });
          return;
        }

        response.status(500).json({ error: "Internal server error" });
      }
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
