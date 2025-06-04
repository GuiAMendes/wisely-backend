// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { FindByNameTopicsUseCase } from "../../../../../application/use-cases/topic/findByName/FindByNameTopics.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./FindByNameTopics.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import { isSafe } from "../../../../../shared/validators";

export class FindByNameTopicsController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findByNameTopicsUseCase: FindByNameTopicsUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    findByNameTopicsUseCase: FindByNameTopicsUseCase,
    tokenService: TokenProvider
  ) {
    return new FindByNameTopicsController(
      "/journey/:id/topics",
      "get",
      findByNameTopicsUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /journey/{id}/topics:
   *   get:
   *     summary: Busca tópicos por nome dentro de uma jornada
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada
   *         schema:
   *           type: string
   *           format: uuid
   *           example: a1e8b58a-2a74-4d21-b3b3-17017783ae6a
   *       - in: query
   *         name: name
   *         required: true
   *         description: Nome (ou parte do nome) do tópico a ser buscado
   *         schema:
   *           type: string
   *           example: Introdução
   *     responses:
   *       200:
   *         description: Lista de tópicos encontrada com sucesso
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
   *                       idTopic:
   *                         type: string
   *                         format: uuid
   *                         example: 8f9f9a32-b5c3-4b0a-9e8f-dc7fbb99a3aa
   *                       name:
   *                         type: string
   *                         example: Introdução ao Node.js
   *                       status:
   *                         type: string
   *                         example: active
   *                       order:
   *                         type: number
   *                         example: 1
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: 2024-09-01T12:00:00Z
   *       400:
   *         description: Nome inválido, mal formatado ou ausente
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idJourney } = request.params;
      const { name: topicName } = request.query;

      if (typeof topicName !== "string") {
        response.status(400).json({ error: "Invalid name format." });
        return;
      }

      if (!topicName) {
        response.status(400).json({ error: "Missing name to topic." });
        return;
      }

      const checktopicName = isSafe(topicName);

      if (!checktopicName) {
        response.status(400).json({ error: "Name is invalid or danger." });
        return;
      }

      try {
        const restoreDirectories = await this.findByNameTopicsUseCase.execute({
          idJourney,
          topicName,
        });

        const output = presenter({
          topics: restoreDirectories.topics,
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
