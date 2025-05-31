// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateProgressUseCase } from "../../../../../application/use-cases/progress/create/CreateProgress.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateProgress.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class CreateProgressController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createProgressUseCase: CreateProgressUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createProgressUseCase: CreateProgressUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateProgressController(
      "/:id/progress",
      "post",
      createProgressUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/progress:
   *   post:
   *     summary: Cria um novo progresso para uma jornada
   *     tags: [Progress]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       201:
   *         description: Progresso criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Progress'
   *       400:
   *         description: ID da jornada ausente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Missing journey id.
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Unauthorized access
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal server error
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idJourney } = request.params;

      if (!idJourney) {
        response.status(400).json({ error: "Missing journey id." });
        return;
      }

      try {
        const createdProgress = await this.createProgressUseCase.execute({
          idJourney,
        });

        const output = presenter(createdProgress);

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
