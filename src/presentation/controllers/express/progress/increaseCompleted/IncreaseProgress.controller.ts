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

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { presenter } from "./IncreaseProgress.presenter";
import { IncreaseProgressUseCase } from "../../../../../application/use-cases/progress/increase/IncreaseProgress.usecase";

export class IncreaseProgressController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly increaseProgressUseCase: IncreaseProgressUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    increaseProgressUseCase: IncreaseProgressUseCase,
    tokenService: TokenProvider
  ) {
    return new IncreaseProgressController(
      "/:id/progress/increase",
      "patch",
      increaseProgressUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/progress/increase:
   *   patch:
   *     summary: Aumenta o progresso da jornada
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
   *       200:
   *         description: Progresso atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Progress'
   *       400:
   *         description: ID da jornada ausente
   *       401:
   *         description: Não autorizado
   *       500:
   *         description: Erro interno do servidor
   */
  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idJourney } = request.params;

      if (!idJourney) {
        response.status(400).json({ error: "Missing journey id." });
        return;
      }

      try {
        const updatedProgress = await this.increaseProgressUseCase.execute({
          idJourney,
        });

        const output = presenter(updatedProgress);

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
