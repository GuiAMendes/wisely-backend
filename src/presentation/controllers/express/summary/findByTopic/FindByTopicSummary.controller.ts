// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { FindByTopicSummaryUseCase } from "../../../../../application/use-cases/summary/findByTopic/FindByTopicSummary.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./FindByTopicSummary.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class FindByTopicSummaryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findByTopicSummaryUseCase: FindByTopicSummaryUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    findByTopicSummaryUseCase: FindByTopicSummaryUseCase,
    tokenService: TokenProvider
  ) {
    return new FindByTopicSummaryController(
      "/topic/:id/summary",
      "get",
      findByTopicSummaryUseCase,
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
   *   get:
   *     summary: Busca o resumo vinculado a um tópico
   *     tags: [Summary]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico do qual se deseja buscar o resumo
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
   *     responses:
   *       200:
   *         description: Resumo encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 summary:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       example: 98765432-1abc-def0-1234-56789abcdef0
   *                     idTopic:
   *                       type: string
   *                       format: uuid
   *                       example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
   *                     title:
   *                       type: string
   *                       example: Introdução ao Express
   *                     note:
   *                       type: object
   *                       description: Objeto contendo as anotações do resumo
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: "2024-05-01T14:00:00Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: "2024-05-03T09:30:00Z"
   *                     completedAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: null
   *                     isActive:
   *                       type: boolean
   *                       example: true
   *       400:
   *         description: ID do tópico ausente ou inválido
   *       401:
   *         description: Não autorizado (token ausente ou inválido)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idTopic } = request.params;

      if (!idTopic) {
        response.status(400).json({ error: "Missing topic id." });
        return;
      }

      try {
        const foundSummary = await this.findByTopicSummaryUseCase.execute({
          idTopic,
        });

        const output = presenter(foundSummary);

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
