// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { DeactivateFlashcardUseCase } from "../../../../../application/use-cases/flashcard/deactivate/DeactivateFlashcard.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./DeactivateJourney.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class DeactivateFlashcardController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deactivateFlashcardUseCase: DeactivateFlashcardUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    deactivateFlashcardUseCase: DeactivateFlashcardUseCase,
    tokenService: TokenProvider
  ) {
    return new DeactivateFlashcardController(
      "/flashcard/:id/deactivate",
      "patch",
      deactivateFlashcardUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /flashcard/{id}/deactivate:
   *   patch:
   *     summary: Desativa um flashcard
   *     tags: [Flashcard]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do flashcard a ser desativado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: flashcard desativada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idFlashcard:
   *                   type: string
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 status:
   *                   type: string
   *                   example: deactivated
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
      const { id: idFlashcard } = request.params;

      try {
        const updatedJourney = await this.deactivateFlashcardUseCase.execute({
          idFlashcard,
        });

        const output = presenter({
          idFlashcard: updatedJourney.idFlashcard,
          status: updatedJourney.status,
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
