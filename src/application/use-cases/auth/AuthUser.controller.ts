// Use case
import { AuthUserUseCase } from "./AuthUser.usecase";

// External libraries
import { Request, Response } from "express";

// Interfaces
import { Cryptation } from "../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { TokenProvider } from "../../infra/services/token/interfaces/token.interfaces";

export class AuthUserController {
  async handle(
    request: Request,
    response: Response,
    cryptation: Cryptation,
    tokenGenerator: TokenProvider
  ) {
    const { email, password } = request.body;

    const authUserUseCase = new AuthUserUseCase();

    const token = await authUserUseCase.execute({
      email,
      password,
      cryptation,
      tokenGenerator,
    });

    return response.status(201).json(token);
  }
}
