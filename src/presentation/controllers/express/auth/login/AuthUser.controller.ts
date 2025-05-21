// External libraries
import { Request, Response } from "express";

// Use case
import { AuthUserUseCase } from "../../../../../application/use-cases/auth/login/AuthUser.usecase";

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

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Autentica um usuário e retorna um token JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: usuario@example.com
   *               password:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       200:
   *         description: Token JWT gerado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       400:
   *         description: Requisição malformada (falta email ou senha)
   *       401:
   *         description: Credenciais inválidas
   *       500:
   *         description: Erro interno do servidor
   */
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
