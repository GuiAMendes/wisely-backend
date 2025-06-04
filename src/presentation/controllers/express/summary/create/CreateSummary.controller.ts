// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateSummaryUseCase } from "../../../../../application/use-cases/summary/create/CreateSummary.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateSummary.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class CreateSummaryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSummaryUseCase: CreateSummaryUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createSummaryUseCase: CreateSummaryUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateSummaryController(
      "/topic/:id/summary",
      "post",
      createSummaryUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /topic/{id}/summary:
   *   post:
   *     summary: Cria um novo resumo para um tópico
   *     tags: [Summary]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico ao qual o resumo será vinculado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - noteContent
   *             properties:
   *               title:
   *                 type: string
   *                 example: Introdução ao Node.js
   *               noteContent:
   *                 type: string
   *                 example: Node.js é um runtime de JavaScript orientado a eventos...
   *     responses:
   *       201:
   *         description: Resumo criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: aabbccdd-1234-5678-9abc-def012345678
   *       400:
   *         description: Dados de entrada inválidos
   *       401:
   *         description: Não autorizado (token ausente ou inválido)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { title, noteContent } = request.body;
      const { id: idTopic } = request.params;

      try {
        const createdSummary = await this.createSummaryUseCase.execute({
          idTopic,
          title,
          noteContent,
        });

        const output = presenter({
          id: createdSummary.id,
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
