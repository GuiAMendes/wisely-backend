// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { UpdateSettingsUseCase } from "../../../../../application/use-cases/settings/update/UpdateSettings.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./UpdateSettings.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

export class UpdateSettingsController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSettingsUseCase: UpdateSettingsUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    updateSettingsUseCase: UpdateSettingsUseCase,
    tokenService: TokenProvider
  ) {
    return new UpdateSettingsController(
      "/:id/settings",
      "patch",
      updateSettingsUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /{id}/settings:
   *   patch:
   *     summary: Atualiza as configurações de um usuário autenticado
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               colorSchema:
   *                 type: object
   *                 properties:
   *                   primaryColor:
   *                     type: string
   *                     example: "#FF6158"
   *                   secondaryColor:
   *                     type: string
   *                     example: "#FEDBE2"
   *     responses:
   *       200:
   *         description: Configurações atualizadas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Success
   *       400:
   *         description: ID do usuário ausente
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { id: idUser } = request.params;
      const { colorSchema } = request.body;

      if (!idUser) {
        response.status(400).json({ error: "Missing user id." });
        return;
      }

      try {
        const updateSetting = await this.updateSettingsUseCase.execute({
          idUser,
          colorSchema,
        });

        const output = presenter(updateSetting);

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
