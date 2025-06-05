// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { CreateFileUseCase } from "../../../../../application/use-cases/fileModel/create/CreateFile.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import type { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Presenter
import { presenter } from "./CreateFile.presenter";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CreateFileController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createFileUseCase: CreateFileUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    createFileUseCase: CreateFileUseCase,
    tokenService: TokenProvider
  ) {
    return new CreateFileController(
      "/topic/:id/file",
      "post",
      createFileUseCase,
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
   *   post:
   *     summary: Cria um novo arquivo associado a um tópico
   *     tags: [File]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do tópico ao qual o arquivo será associado
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
   *               - fileName
   *               - fileType
   *               - fileContent
   *             properties:
   *               fileName:
   *                 type: string
   *                 description: Nome do arquivo
   *                 example: IntroducaoNodeJS.pdf
   *               fileType:
   *                 type: string
   *                 description: Tipo ou extensão do arquivo
   *                 example: pdf
   *               fileContent:
   *                 type: string
   *                 description: Conteúdo do arquivo codificado em base64 ou como string
   *                 example: "c29tZSBjb250ZW50IGluIGJhc2U2NA=="
   *     responses:
   *       201:
   *         description: Arquivo criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   example: 123e4567-e89b-12d3-a456-426614174abc
   *                 fileName:
   *                   type: string
   *                   example: IntroducaoNodeJS.pdf
   *                 fileType:
   *                   type: string
   *                   example: pdf
   *                 fileContent:
   *                   type: string
   *                   example: "c29tZSBjb250ZW50IGluIGJhc2U2NA=="
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
      const { fileName, fileType, fileContent } = request.body;
      const { id: idTopic } = request.params;

      try {
        const createdFile = await this.createFileUseCase.execute({
          idTopic,
          fileName,
          fileType,
          fileContent,
        });

        const output = presenter({
          id: createdFile.id,
          fileName: createdFile.fileName,
          fileType: createdFile.fileType,
          fileContent: createdFile.fileContent,
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
