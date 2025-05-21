// External libraries
import { Request, Response } from "express";

// Use case
import { RenameDirectoryUseCase } from "../../../../../application/use-cases/directory/rename/RenameDirectory.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter

// Validator

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";
import { isSafe } from "../../../../../shared/validators";
import { presenter } from "./RenameDirectory.presenter";

export class RenameDirectoryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameDirectoryUseCase: RenameDirectoryUseCase
  ) {}

  public static create(renameDirectoryUseCase: RenameDirectoryUseCase) {
    return new RenameDirectoryController(
      "/directory/:id/rename",
      "patch",
      renameDirectoryUseCase
    );
  }

  /**
   * @swagger
   * /Directory/{id}/rename:
   *   patch:
   *     summary: Altera o nome de diretório de um diretório existente
   *     tags: [Directory]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do diretório a ser renomeado
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
   *               - newDirectoryName
   *             properties:
   *               newDirectoryName:
   *                 type: string
   *                 example: novoDiretório123
   *     responses:
   *       200:
   *         description: Nome de diretório atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idDirectory:
   *                   type: string
   *                   format: uuid
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 Directoryname:
   *                   type: string
   *                   example: novoUsuario123
   *       400:
   *         description: Requisição malformada (nome de diretório inválido ou perigoso)
   *       401:
   *         description: Não autorizado
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { newDirectoryName } = request.body;
      const { id: idDirectory } = request.params;

      const checkDirectory = isSafe(newDirectoryName);

      if (!checkDirectory) {
        response
          .status(400)
          .json({ error: "The new Directoryname is invalid or ansafety." });
        return;
      }

      try {
        const updatedDirectory = await this.renameDirectoryUseCase.execute({
          idDirectory,
          newDirectoryName,
        });

        const output = presenter({
          idDirectory: updatedDirectory.idDirectory,
          newDirectoryName: updatedDirectory.directoryName,
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
