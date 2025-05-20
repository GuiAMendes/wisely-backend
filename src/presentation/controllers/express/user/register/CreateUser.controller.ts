// External libraries
import { Request, Response } from "express";

// Entity
import { User } from "../../../../../domain/entity/user/User";

// Use case
import { CreateUserUseCase } from "../../../../../application/use-cases/user/create/CreateUser.usecase";

// Interfaces
import { Cryptation } from "../../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./CreateUser.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { UuidGenerator } from "../../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class CreateUserController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserUseCase: CreateUserUseCase,
    private uuidService: UuidGenerator,
    private readonly cryptationService: Cryptation
  ) {}

  public static create(
    createUserUseCase: CreateUserUseCase,
    uuidService: UuidGenerator,
    cryptationService: Cryptation
  ) {
    return new CreateUserController(
      "/register",
      "post",
      createUserUseCase,
      uuidService,
      cryptationService
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { username, email, password } = request.body;

      const checkUser = User.create(
        username,
        email,
        password,
        this.uuidService,
        this.cryptationService
      );

      if (!checkUser) {
        response
          .status(400)
          .json({ error: "Missing username, email or password atribute." });
        return;
      }

      try {
        const createdUser = await this.createUserUseCase.execute({
          username,
          email,
          password,
        });

        console.log(createdUser);

        const output = presenter(createdUser);

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
