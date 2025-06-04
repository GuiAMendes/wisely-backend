// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CompleteTopicUseCase } from "../../../../../application/use-cases/topic/complete/CompleteTopic.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CompleteTopic.presenter";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CompleteTopicController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly completeTopicUseCase: CompleteTopicUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    completeTopicUseCase: CompleteTopicUseCase,
    tokenService: TokenProvider
  ) {
    return new CompleteTopicController(
      "/topic/:id/complete",
      "patch",
      completeTopicUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /topic/{id}/complete:
   *   patch:
   *     summary: Marca um tópico como completo
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico a ser marcado como completo
   *         schema:
   *           type: string
   *           format: uuid
   *           example: f04cb80a-a19a-4b87-9533-0d539bfaea09
   *     responses:
   *       200:
   *         description: Tópico marcado como completo com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idTopic:
   *                   type: string
   *                   format: uuid
   *                   example: f04cb80a-a19a-4b87-9533-0d539bfaea09
   *                 status:
   *                   type: string
   *                   example: completed
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idTopic } = request.params;

      try {
        const updatedTopic = await this.completeTopicUseCase.execute({
          idTopic,
        });

        const output = presenter({
          idTopic: updatedTopic.idTopic,
          status: updatedTopic.status,
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
