// External libraries
import { Request, Response } from "express";

// Use case
import { ListDirectoriesAccessedRecentlyUseCase } from "../../../../../application/use-cases/directory/listRecents/ListAllDirectories.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListDirectoriesAccessedRecently.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListDirectoriesAccessedRecentlyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listDirectoriesAccessedRecentlyUseCase: ListDirectoriesAccessedRecentlyUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listDirectoriesAccessedRecentlyUseCase: ListDirectoriesAccessedRecentlyUseCase,
    tokenService: TokenProvider
  ) {
    return new ListDirectoriesAccessedRecentlyController(
      "/:id/directory/recents",
      "get",
      listDirectoriesAccessedRecentlyUseCase,
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
        const restoreDirectories =
          await this.listDirectoriesAccessedRecentlyUseCase.execute({
            idUser,
          });

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
