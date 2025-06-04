// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateTopicUseCase } from "../../../../../application/use-cases/topic/create/CreateTopic.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateTopic.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Validator
import { isSafe } from "../../../../../shared/validators";

export class CreateTopicController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createTopicUseCase: CreateTopicUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateTopicController(
      "/journey/:id/topic",
      "post",
      createTopicUseCase,
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
   *   post:
   *     summary: Cria um novo tópico dentro da jornada especificada
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada em que o tópico será criado
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
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Introdução ao TypeScript"
   *     responses:
   *       201:
   *         description: Tópico criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: "abc12345-def6-7890-gh12-ijklmnopqrst"
   *       400:
   *         description: Requisição malformada (nome ausente ou inválido)
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */
  getHandler() {
    return async (request: Request, response: Response) => {
      const { name } = request.body;
      const { id: idJourney } = request.params;

      const checkTopic = isSafe(name);

      if (!checkTopic) {
        response.status(400).json({ error: "Missing name to topic." });
        return;
      }

      try {
        const createdTopic = await this.createTopicUseCase.execute({
          idJourney,
          name,
        });

        const output = presenter({
          id: createdTopic.id,
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
