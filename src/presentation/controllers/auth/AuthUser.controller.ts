// Use case
import { AuthUserUseCase } from "../../../application/use-cases/auth/AuthUser.usecase";

// External libraries
import { Request, Response } from "express";

// Interfaces
import { Cryptation } from "../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { TokenProvider } from "../../../infra/services/token/interfaces/token.interfaces";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

export class AuthUserController {
  async handle(
    request: Request,
    response: Response,
    cryptation: Cryptation,
    tokenGenerator: TokenProvider
  ) {
    const { email, password } = request.body;

    const authUserUseCase = new AuthUserUseCase();

    try {
      const token = await authUserUseCase.execute({
        email,
        password,
        cryptation,
        tokenGenerator,
      });

      return response.status(201).json(token);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return response.status(401).json({ error: error.message });
      }

      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
