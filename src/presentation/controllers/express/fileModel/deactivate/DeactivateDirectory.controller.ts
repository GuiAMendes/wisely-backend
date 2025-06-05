// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { DeactivateFileUseCase } from "../../../../../application/use-cases/fileModel/deactivate/DeactivateTopic.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

/// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./DeactivateDirectory.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class DeactivateFileController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deactivateFileUseCase: DeactivateFileUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    deactivateFileUseCase: DeactivateFileUseCase,
    tokenService: TokenProvider
  ) {
    return new DeactivateFileController(
      "/file/:id/deactivate",
      "patch",
      deactivateFileUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /file/{id}/deactivate:
   *   patch:
   *     summary: Desativa um arquivo
   *     tags: [File]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do arquivo a ser desativado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: abc123
   *     responses:
   *       200:
   *         description: Arquivo desativado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idFile:
   *                   type: string
   *                   format: uuid
   *                   example: abc123
   *                 status:
   *                   type: string
   *                   example: inactive
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Unauthorized
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
      const { id: idFile } = request.params;

      try {
        const updatedFile = await this.deactivateFileUseCase.execute({
          idFile,
        });

        const output = presenter({
          idFile: updatedFile.idFile,
          status: updatedFile.status,
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
