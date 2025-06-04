// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { ResumeStatisticsOfProgressUseCase } from "../../../../../application/use-cases/progress/resumeStatistics/IncreaseProgress.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./ResumeStatisticsOfProgress.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class ResumeStatisticsOfProgressController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly resumeStatisticsOfProgressUseCase: ResumeStatisticsOfProgressUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    resumeStatisticsOfProgressUseCase: ResumeStatisticsOfProgressUseCase,
    tokenService: TokenProvider
  ) {
    return new ResumeStatisticsOfProgressController(
      "/user/:id/progress/resumeStatistics",
      "get",
      resumeStatisticsOfProgressUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /user/{id}/progress/resumeStatistics:
   *   get:
   *     summary: Retorna estatísticas resumidas de progresso do usuário
   *     tags: [Progress]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário para o qual se deseja obter as estatísticas de progresso
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Estatísticas de progresso retornadas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idUser:
   *                   type: string
   *                   format: uuid
   *                   example: "123e4567-e89b-12d3-a456-426614174000"
   *                 totalJourneys:
   *                   type: integer
   *                   example: 5
   *                 completedJourneys:
   *                   type: integer
   *                   example: 3
   *                 totalTopics:
   *                   type: integer
   *                   example: 40
   *                 completedTopics:
   *                   type: integer
   *                   example: 30
   *                 completionPercentage:
   *                   type: number
   *                   format: float
   *                   example: 75.0
   *                 journeysProgress:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       journeyName:
   *                         type: string
   *                         example: "JavaScript Essentials"
   *                       completedTopics:
   *                         type: integer
   *                         example: 10
   *                       totalTopics:
   *                         type: integer
   *                         example: 12
   *                       completionPercentage:
   *                         type: number
   *                         format: float
   *                         example: 83.33
   *       400:
   *         description: Requisição malformada (ID do usuário ausente)
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idUser } = request.params;

      if (!idUser) {
        response.status(400).json({ error: "Missing user id." });
        return;
      }

      try {
        const updatedProgress =
          await this.resumeStatisticsOfProgressUseCase.execute({
            idUser,
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
