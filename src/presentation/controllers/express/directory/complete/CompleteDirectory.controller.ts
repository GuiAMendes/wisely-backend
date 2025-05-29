// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CompleteDirectoryUseCase } from "../../../../../application/use-cases/directory/complete/CompleteDirectory.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CompleteDirectory.presenter";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CompleteDirectoryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly completeDirectoryUseCase: CompleteDirectoryUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    completeDirectoryUseCase: CompleteDirectoryUseCase,
    tokenService: TokenProvider
  ) {
    return new CompleteDirectoryController(
      "/directory/:id/complete",
      "patch",
      completeDirectoryUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /directory/{id}/complete:
   *   patch:
   *     summary: Marca um diretório como completo
   *     tags: [Directory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do diretório a ser completado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: d1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6
   *     responses:
   *       200:
   *         description: Diretório marcado como completo com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idDirectory:
   *                   type: string
   *                   example: d1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6
   *                 status:
   *                   type: boolean
   *                   example: true
   *       401:
   *         description: Não autorizado (sem autenticação ou token inválido)
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
      const { id: idDirectory } = request.params;

      try {
        const updatedDirectory = await this.completeDirectoryUseCase.execute({
          idDirectory,
        });

        const output = presenter({
          idDirectory: updatedDirectory.idDirectory,
          status: updatedDirectory.status,
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
