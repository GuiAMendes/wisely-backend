// External libraries
import { Request, Response } from "express";

// Use case
import { AuthUserUseCase } from "../../../../../application/use-cases/auth/AuthUser.usecase";

// Interfaces
import { Cryptation } from "../../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./AuthUser.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class AuthUserController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly authUserService: AuthUserUseCase,
    private readonly cryptationService: Cryptation,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    authUserService: AuthUserUseCase,
    cryptationService: Cryptation,
    tokenService: TokenProvider
  ) {
    return new AuthUserController(
      "/login",
      "post",
      authUserService,
      cryptationService,
      tokenService
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { email, password } = request.body;

      if (!email || !password) {
        response.status(400).json({ error: "Missing email or password" });
        return;
      }

      try {
        const token = await this.authUserService.execute({
          email,
          password,
          cryptation: this.cryptationService,
          tokenGenerator: this.tokenService,
        });

        const output = presenter(token);

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
