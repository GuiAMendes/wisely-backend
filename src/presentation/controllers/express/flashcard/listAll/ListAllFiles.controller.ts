// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { ListAllFlashcardsUseCase } from "../../../../../application/use-cases/flashcard/listAll/ListAllFlashcards.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllFiles.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllFlashcardsController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllFlashcardsUseCase: ListAllFlashcardsUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllFlashcardsUseCase: ListAllFlashcardsUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllFlashcardsController(
      "/topic/:id/flashcard",
      "get",
      listAllFlashcardsUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /topic/{id}/flashcard:
   *   get:
   *     summary: Lista todos os flashcards de um tópico
   *     tags: [Flashcard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico para listar os flashcards
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Lista de flashcards retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 flashcards:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                         example: 9ac34a34-ef90-4bcd-8910-73d6cf6a0f89
   *                       topicId:
   *                         type: string
   *                         format: uuid
   *                         example: 123e4567-e89b-12d3-a456-426614174000
   *                       question:
   *                         type: object
   *                         example: { content: "O que é React?" }
   *                       response:
   *                         type: object
   *                         example: { content: "Uma biblioteca JavaScript para construir interfaces de usuário." }
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T12:00:00Z"
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                         nullable: true
   *                         example: "2024-01-05T08:30:00Z"
   *                       completedAt:
   *                         type: string
   *                         format: date-time
   *                         nullable: true
   *                         example: null
   *                       isActive:
   *                         type: boolean
   *                         example: true
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Unauthorized
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
      const { id: idTopic } = request.params;

      try {
        const restoreFlashcards = await this.listAllFlashcardsUseCase.execute({
          idTopic,
        });

        const output = presenter({
          flashcards: restoreFlashcards.flashcards,
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
