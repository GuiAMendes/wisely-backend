// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { RenameTopicUseCase } from "../../../../../application/use-cases/topic/rename/RenameTopic.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./RenameTopic.presenter";

// Validator
import { isSafe } from "../../../../../shared/validators";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class RenameTopicController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameTopicUseCase: RenameTopicUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    renameTopicUseCase: RenameTopicUseCase,
    tokenService: TokenProvider
  ) {
    return new RenameTopicController(
      "/topic/:id/rename",
      "patch",
      renameTopicUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /topic/{id}/rename:
   *   patch:
   *     summary: Renomeia um tópico existente
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico a ser renomeado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: f04cb80a-a19a-4b87-9533-0d539bfaea09
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - newTopicName
   *             properties:
   *               newTopicName:
   *                 type: string
   *                 example: Introdução à Web Moderna
   *     responses:
   *       200:
   *         description: Tópico renomeado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idTopic:
   *                   type: string
   *                   format: uuid
   *                   example: f04cb80a-a19a-4b87-9533-0d539bfaea09
   *                 newTopicName:
   *                   type: string
   *                   example: Introdução à Web Moderna
   *       400:
   *         description: Nome inválido ou potencialmente inseguro
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { newTopicName } = request.body;
      const { id: idTopic } = request.params;

      const checkTopic = isSafe(newTopicName);

      if (!checkTopic) {
        response
          .status(400)
          .json({ error: "The new topic name is invalid or ansafety." });
        return;
      }

      try {
        const updatedTopic = await this.renameTopicUseCase.execute({
          idTopic,
          newTopicName,
        });

        const output = presenter({
          idTopic: updatedTopic.idTopic,
          newTopicName: updatedTopic.topicName,
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
