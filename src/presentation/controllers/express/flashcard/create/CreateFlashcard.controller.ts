// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateFlashcardUseCase } from "../../../../../application/use-cases/flashcard/create/CreateFlashcard.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateFlashcard.presenter";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CreateFlashcardController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createFlashcardUseCase: CreateFlashcardUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createFlashcardUseCase: CreateFlashcardUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateFlashcardController(
      "/topic/:id/flashcard",
      "post",
      createFlashcardUseCase,
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
   *   post:
   *     summary: Cria um novo flashcard associado a um tópico
   *     tags: [Flashcard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico ao qual o flashcard será associado
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
   *               - questionContent
   *               - responseContent
   *             properties:
   *               questionContent:
   *                 type: string
   *                 description: Conteúdo da pergunta do flashcard
   *                 example: O que é Node.js?
   *               responseContent:
   *                 type: string
   *                 description: Conteúdo da resposta do flashcard
   *                 example: Node.js é um ambiente de execução JavaScript no lado do servidor.
   *     responses:
   *       201:
   *         description: Flashcard criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: f19c3e20-bc12-4cb4-bca3-167b2a2d8800
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
      const { questionContent, responseContent } = request.body;
      const { id: idTopic } = request.params;

      try {
        const createdFlashcard = await this.createFlashcardUseCase.execute({
          idTopic,
          questionContent,
          responseContent,
        });

        const output = presenter({
          id: createdFlashcard.id,
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
