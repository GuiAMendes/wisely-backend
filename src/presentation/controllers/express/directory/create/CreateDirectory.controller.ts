// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateDirectoryUseCase } from "../../../../../application/use-cases/directory/create/CreateDirectory.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./CreateDirectory.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { isSafe } from "../../../../../shared/validators";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

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

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/directory:
   *   post:
   *     summary: Cria um novo diretório para o usuário especificado
   *     tags: [Directory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário que irá receber o diretório
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: "MeuDiretorio"
   *               isTemplate:
   *                 type: boolean
   *                 example: false
   *     responses:
   *       201:
   *         description: Diretório criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: "abc12345-def6-7890-gh12-ijklmnopqrst"
   *                 name:
   *                   type: string
   *                   example: "MeuDiretorio"
   *       400:
   *         description: Requisição malformada (nome inválido ou ausente)
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
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
