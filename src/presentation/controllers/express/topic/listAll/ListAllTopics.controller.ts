// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { ListAllTopicsUseCase } from "../../../../../application/use-cases/topic/listAll/ListAllTopics.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllTopics.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllTopicsController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllTopicsUseCase: ListAllTopicsUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllTopicsUseCase: ListAllTopicsUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllTopicsController(
      "/journey/:id/topic",
      "get",
      listAllTopicsUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /journey/{id}/topic:
   *   get:
   *     summary: Lista todos os tópicos de uma jornada
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada cujos tópicos serão listados
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 0250a261-6b97-4786-8a73-8f6c88430cfb
   *     responses:
   *       200:
   *         description: Lista de tópicos retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 topics:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       props:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                             example: f04cb80a-a19a-4b87-9533-0d539bfaea09
   *                           idJourney:
   *                             type: string
   *                             format: uuid
   *                             example: 0250a261-6b97-4786-8a73-8f6c88430cfb
   *                           topicName:
   *                             type: string
   *                             example: contextualizanod o desenvolvimento web
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                             example: 2025-06-04T03:16:15.000Z
   *                           updatedAt:
   *                             type: string
   *                             format: date-time
   *                             example: 2025-06-04T03:16:15.000Z
   *                           completedAt:
   *                             type: string
   *                             format: date-time
   *                             nullable: true
   *                             example: null
   *                           isActive:
   *                             type: boolean
   *                             example: true
   *                           isConcluded:
   *                             type: boolean
   *                             example: false
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idJourney } = request.params;

      try {
        const restoreTopics = await this.listAllTopicsUseCase.execute({
          idJourney,
        });

        const output = presenter({
          topics: restoreTopics.topics,
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
