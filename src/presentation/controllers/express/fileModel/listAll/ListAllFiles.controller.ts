// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { ListAllFilesUseCase } from "../../../../../application/use-cases/fileModel/listAll/ListAllFiles.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllFiles.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllFilesController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllFilesUseCase: ListAllFilesUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllFilesUseCase: ListAllFilesUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllFilesController(
      "/topic/:id/file",
      "get",
      listAllFilesUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /topic/{id}/file:
   *   get:
   *     summary: Lista todos os arquivos associados a um tópico
   *     tags: [File]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico do qual os arquivos serão listados
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Lista de arquivos retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 files:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                         example: abc123
   *                       topicId:
   *                         type: string
   *                         format: uuid
   *                         example: 123e4567-e89b-12d3-a456-426614174000
   *                       fileName:
   *                         type: string
   *                         example: IntroducaoNodeJS.pdf
   *                       fileType:
   *                         type: string
   *                         example: pdf
   *                       filePath:
   *                         type: object
   *                         description: Metadados do caminho do arquivo
   *                       uploadDate:
   *                         type: string
   *                         format: date-time
   *                         example: 2025-05-22T14:00:00Z
   *                       isActive:
   *                         type: boolean
   *                         example: true
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
      const { id: idTopic } = request.params;

      try {
        const restoreFiles = await this.listAllFilesUseCase.execute({
          idTopic,
        });

        const output = presenter({
          files: restoreFiles.files,
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
