// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { UpdateQuestionOfFlashcardUseCase } from "../../../../../application/use-cases/flashcard/updateQuestion/UpdateQuestionOfFlashcard.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./UpdateQuestionOfFlashcard.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class UpdateQuestionOfFlashcardUseCaseController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateQuestionOfFlashcardUseCase: UpdateQuestionOfFlashcardUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    updateQuestionOfFlashcardUseCase: UpdateQuestionOfFlashcardUseCase,
    tokenService: TokenProvider
  ) {
    return new UpdateQuestionOfFlashcardUseCaseController(
      "/flashcard/:id/updateQuestion",
      "patch",
      updateQuestionOfFlashcardUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /flashcard/{id}/updateQuestion:
   *   patch:
   *     summary: Atualiza o conteúdo da pergunta de um flashcard
   *     tags: [Flashcard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do flashcard a ser atualizado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 9ac34a34-ef90-4bcd-8910-73d6cf6a0f89
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - newQuestionContent
   *             properties:
   *               newQuestionContent:
   *                 type: string
   *                 description: Novo conteúdo da pergunta
   *                 example: Qual é o conceito principal de componentes no React?
   *     responses:
   *       200:
   *         description: Pergunta atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idFlashcard:
   *                   type: string
   *                   format: uuid
   *                   example: 9ac34a34-ef90-4bcd-8910-73d6cf6a0f89
   *                 newQuestionContent:
   *                   type: string
   *                   example: Qual é o conceito principal de componentes no React?
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
      const { newQuestionContent } = request.body;
      const { id: idFlashcard } = request.params;

      try {
        const updatedDirectory =
          await this.updateQuestionOfFlashcardUseCase.execute({
            idFlashcard,
            newQuestionContent,
          });

        const output = presenter({
          idFlashcard: updatedDirectory.idFlashcard,
          newQuestionContent: updatedDirectory.newQuestionContent,
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
