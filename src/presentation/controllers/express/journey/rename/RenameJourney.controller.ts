// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { RenameJourneyUseCase } from "../../../../../application/use-cases/journey/rename/RenameJourney.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./RenameJourney.presenter";

// Validator
import { isSafe } from "../../../../../shared/validators";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class RenameJourneyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameJourneyUseCase: RenameJourneyUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    renameJourneyUseCase: RenameJourneyUseCase,
    tokenService: TokenProvider
  ) {
    return new RenameJourneyController(
      "/journey/:id/rename",
      "patch",
      renameJourneyUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /journey/{id}/rename:
   *   patch:
   *     summary: Renomeia uma jornada existente
   *     tags: [Journey]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada a ser renomeada
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
   *             properties:
   *               newJourneyName:
   *                 type: string
   *                 example: Nova Jornada de Onboarding
   *     responses:
   *       200:
   *         description: Jornada renomeada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idJourney:
   *                   type: string
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 newJourneyName:
   *                   type: string
   *                   example: Nova Jornada de Onboarding
   *       400:
   *         description: Nome inválido ou inseguro
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: The new Journeyname is invalid or ansafety.
   *       401:
   *         description: Não autorizado (acesso negado)
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
      const { newJourneyName } = request.body;
      const { id: idJourney } = request.params;

      const checkJourney = isSafe(newJourneyName);

      if (!checkJourney) {
        response
          .status(400)
          .json({ error: "The new Journeyname is invalid or ansafety." });
        return;
      }

      try {
        const updatedJourney = await this.renameJourneyUseCase.execute({
          idJourney,
          newJourneyName,
        });

        const output = presenter({
          idJourney: updatedJourney.idJourney,
          newJourneyName: updatedJourney.journeyName,
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
