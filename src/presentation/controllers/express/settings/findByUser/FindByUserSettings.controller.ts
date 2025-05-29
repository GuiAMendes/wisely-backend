// External libraries
import { Request, Response } from "express";

// Use case
import { FindByUserSettingsUseCase } from "../../../../../application/use-cases/settings/findByUser/FindByUserSettings.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./FindByUserSettings.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class FindByUserSettingsController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findByUserSettingsUseCase: FindByUserSettingsUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    findByUserSettingsUseCase: FindByUserSettingsUseCase,
    tokenService: TokenProvider
  ) {
    return new FindByUserSettingsController(
      "/:id/settings",
      "get",
      findByUserSettingsUseCase,
      tokenService
    );
  }

  /**
   * @swagger
   * /{id}/settings:
   *   get:
   *     summary: Retorna as configurações do usuário autenticado
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Configurações retornadas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idUser:
   *                   type: string
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 settings:
   *                   type: object
   *                   example:
   *                     primaryColor: "#FEDBE2"
   *                     secondaryColor: "#FF6158"
   *                     notifications: true
   *       400:
   *         description: ID do usuário ausente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Missing user id.
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
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

      const { id: idUser } = request.params;

      if (!idUser) {
        response.status(400).json({ error: "Missing user id." });
        return;
      }

      try {
        const foundSetting = await this.findByUserSettingsUseCase.execute({
          idUser,
        });

        const output = presenter(foundSetting);

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
