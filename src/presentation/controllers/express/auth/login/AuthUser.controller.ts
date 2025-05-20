// External libraries
import { Request, Response } from "express";

// Use case
import { AuthUserUseCase } from "../../../../../application/use-cases/auth/login/AuthUser.usecase";

// Value object
import { Email } from "../../../../../domain/value-object/user/Email";
import { Password } from "../../../../../domain/value-object/user/Password";

// Interfaces
import type { Cryptation } from "../../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

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

      const checkEmail = Email.create(email);

      const checkPassword = Password.create(password, this.cryptationService);

      if (!checkEmail || !checkPassword) {
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
