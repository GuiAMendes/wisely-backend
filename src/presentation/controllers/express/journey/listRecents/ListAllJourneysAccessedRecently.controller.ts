// External libraries
import { Request, Response } from "express";

// Use case
import { ListAllJourneyAccessedRecentlyUseCase } from "../../../../../application/use-cases/journey/listRecents/ListAllJourneyAccessedRecently.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllJourneyAccessedRecently.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllJourneyAccessedRecentlyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllJourneyAccessedRecentlyUseCase: ListAllJourneyAccessedRecentlyUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllJourneyAccessedRecentlyUseCase: ListAllJourneyAccessedRecentlyUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllJourneyAccessedRecentlyController(
      "/:id/journey/recents",
      "get",
      listAllJourneyAccessedRecentlyUseCase,
      tokenService
    );
  }

  /**
   * @swagger
   * /{id}/journey/recents:
   *   get:
   *     summary: Lista jornadas acessadas recentemente em um diretório
   *     tags: [Journey]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do diretório
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Jornadas acessadas recentemente listadas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 journeys:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: abc1234-def5678-ghijklmn
   *                       name:
   *                         type: string
   *                         example: Jornada de Treinamento
   *                       typeOfJourney:
   *                         type: string
   *                         example: training
   *                       lastAccessedAt:
   *                         type: string
   *                         format: date-time
   *                         example: 2025-05-22T15:30:00Z
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
      const authOk = await new Promise<boolean>((resolve) => {
        ensureAuthenticated(
          request,
          response,
          (err) => {
            if (err) return resolve(false);
            resolve(true);
          },
          this.tokenService
        );
      });

      if (!authOk) return;
      const { id: idDirectory } = request.params;

      try {
        const restoreJourneys =
          await this.listAllJourneyAccessedRecentlyUseCase.execute({
            idDirectory,
          });

        const output = presenter({
          journeys: restoreJourneys.journeys,
        });

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
