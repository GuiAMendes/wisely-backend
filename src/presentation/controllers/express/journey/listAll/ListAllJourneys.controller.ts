// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { ListAllJourneysUseCase } from "../../../../../application/use-cases/journey/listAll/ListAllJourneys.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllJourneys.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllJourneysController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllJourneysUseCase: ListAllJourneysUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllJourneysUseCase: ListAllJourneysUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllJourneysController(
      "/:id/journey",
      "get",
      listAllJourneysUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/journey:
   *   get:
   *     summary: Lista todas as jornadas de um diretório
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
   *           example: d1e2f3g4-h5i6-7890-abcd-ef1234567890
   *     responses:
   *       200:
   *         description: Jornadas listadas com sucesso
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
   *                         example: j1k2l3m4-n5o6-7890-abcd-ef1234567890
   *                       name:
   *                         type: string
   *                         example: Jornada de Onboarding
   *                       typeOfJourney:
   *                         type: string
   *                         example: onboarding
   *       401:
   *         description: Não autorizado (token ausente ou inválido)
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

      try {
        const restoreJourneys = await this.listAllJourneysUseCase.execute({
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
