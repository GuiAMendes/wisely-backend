// External libraries
import { Request, Response } from "express";

// Use case
import { CreateDirectoryUseCase } from "../../../../../application/use-cases/directory/create/CreateDirectory.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./CreateDirectory.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { isSafe } from "../../../../../shared/validators";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class CreateDirectoryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createDirectoryUseCase: CreateDirectoryUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createDirectoryUseCase: CreateDirectoryUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateDirectoryController(
      "/:id/directory",
      "post",
      createDirectoryUseCase,
      tokenService
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const authOk = await new Promise<boolean>((resolve) => {
        ensureAuthenticated(
          request,
          response,
          (err) => {
            if (err) return resolve(false);
            resolve(true);
          },
          this.tokenService
        );
      });

      if (!authOk) return;

      const { name, isTemplate } = request.body;
      const { id: idUser } = request.params;

      const checkDirectory = isSafe(name);

      if (!checkDirectory) {
        response.status(400).json({ error: "Missing name to directory." });
        return;
      }

      try {
        const createdDirectory = await this.createDirectoryUseCase.execute({
          idUser,
          name,
          isTemplate,
        });

        console.log(createdDirectory);

        const output = presenter({
          id: createdDirectory.id,
          name: createdDirectory.name,
        });

        response.status(201).json(output);
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
