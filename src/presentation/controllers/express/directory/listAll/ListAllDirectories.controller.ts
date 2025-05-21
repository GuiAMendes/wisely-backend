// External libraries
import { Request, Response } from "express";

// Use case
import { ListAllDirectoriesUseCase } from "../../../../../application/use-cases/directory/listAll/ListAllDirectories.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllDirectories.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllDirectoriesController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllDirectoriesUseCase: ListAllDirectoriesUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllDirectoriesUseCase: ListAllDirectoriesUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllDirectoriesController(
      "/:id/directory",
      "get",
      listAllDirectoriesUseCase,
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
      const { id: idUser } = request.params;

      try {
        const restoreDirectories = await this.listAllDirectoriesUseCase.execute(
          {
            idUser,
          }
        );

        const output = presenter({
          directories: restoreDirectories.directories,
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
