// External libraries
import { Request, Response } from "express";

// Use case
import { CreateJourneyUseCase } from "../../../../../application/use-cases/journey/create/CreateJourney.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateJourney.presenter";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Validator
import { isSafe } from "../../../../../shared/validators";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CreateJourneyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createJourneyUseCase: CreateJourneyUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createJourneyUseCase: CreateJourneyUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateJourneyController(
      "/:id/journey",
      "post",
      createJourneyUseCase,
      tokenService
    );
  }

  /**
   * @swagger
   * /{id}/journey:
   *   post:
   *     summary: Cria uma nova jornada para um diretório
   *     tags: [Journey]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do diretório onde a jornada será criada
   *         schema:
   *           type: string
   *           format: uuid
   *           example: d1e2f3g4-h5i6-7890-abcd-ef1234567890
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - typeOfJourney
   *             properties:
   *               name:
   *                 type: string
   *                 example: free ou full
   *               typeOfJourney:
   *                 type: string
   *                 example: onboarding
   *     responses:
   *       201:
   *         description: Jornada criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: j1k2l3m4-n5o6-7890-abcd-ef1234567890
   *                 name:
   *                   type: string
   *                   example: free ou full
   *                 typeOfJourney:
   *                   type: string
   *                   example: onboarding
   *       400:
   *         description: Nome da jornada ausente ou inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Missing name to journey.
   *       401:
   *         description: Não autorizado (token ausente ou inválido)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Unauthorized access
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
      const authOk = await new Promise<boolean>((resolve) => {
        ensureAuthenticated(
          request,
          response,
          (err) => {
            if (err) return resolve(false);
            resolve(true);
          },
          this.tokenService
        );
      });

      if (!authOk) return;

      const { name, typeOfJourney } = request.body;
      const { id: idDirectory } = request.params;

      const checkJourney = isSafe(name);

      if (!checkJourney) {
        response.status(400).json({ error: "Missing name to journey." });
        return;
      }

      try {
        const createdJourney = await this.createJourneyUseCase.execute({
          idDirectory,
          name,
          typeOfJourney,
        });

        const output = presenter({
          id: createdJourney.id,
          name: createdJourney.name,
          typeOfJourney: createdJourney.typeOfJourney,
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
