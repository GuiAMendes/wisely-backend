// External libraries
import { Request, Response } from "express";

// Entity
import { User } from "../../../../../domain/entity/user/User";

// Use case
import { CreateUserUseCase } from "../../../../../application/use-cases/user/create/CreateUser.usecase";

// Interfaces
import { Cryptation } from "../../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

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

  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Cria um novo usuário no sistema
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: usuario123
   *               email:
   *                 type: string
   *                 format: email
   *                 example: usuario@example.com
   *               password:
   *                 type: string
   *                 example: pwdSegura@123
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 username:
   *                   type: string
   *                   example: usuario123
   *                 email:
   *                   type: string
   *                   format: email
   *                   example: usuario@example.com
   *       400:
   *         description: Requisição malformada (faltando username, email ou senha)
   *       401:
   *         description: Não autorizado
   *       500:
   *         description: Erro interno do servidor
   */
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
