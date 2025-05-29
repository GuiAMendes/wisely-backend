// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { FindByNameDirectoriesUseCase } from "../../../../../application/use-cases/directory/findByName/FindByNameDirectories.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./FindByNameJourneys.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import { isSafe } from "../../../../../shared/validators";
import { FindByNameJourneysUseCase } from "../../../../../application/use-cases/journey/findByName/FindByNameJourneys.usecase";

export class FindByNameJourneysController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findByNameJourneysUseCase: FindByNameJourneysUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    findByNameJourneysUseCase: FindByNameJourneysUseCase,
    tokenService: TokenProvider
  ) {
    return new FindByNameJourneysController(
      "/:id/journeys",
      "get",
      findByNameJourneysUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/journeys:
   *   get:
   *     summary: Busca jornadas por nome dentro de um diretório
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
   *       - in: query
   *         name: name
   *         required: true
   *         description: Nome (ou parte do nome) da jornada a ser buscada
   *         schema:
   *           type: string
   *           example: Treinamento
   *     responses:
   *       200:
   *         description: Jornadas encontradas com sucesso
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
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: 2025-05-22T12:00:00Z
   *       400:
   *         description: Erro de validação (parâmetro ausente ou inválido)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Missing name to journey.
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
      const { id: idDirectory } = request.params;
      const { name: journeyName } = request.query;

      if (typeof journeyName !== "string") {
        response.status(400).json({ error: "Invalid name format." });
        return;
      }

      if (!journeyName) {
        response.status(400).json({ error: "Missing name to journey." });
        return;
      }

      const checkJourneyName = isSafe(journeyName);

      if (!checkJourneyName) {
        response.status(400).json({ error: "Name is invalid or danger." });
        return;
      }

      try {
        const restoreJourneys = await this.findByNameJourneysUseCase.execute({
          idDirectory,
          journeyName,
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
