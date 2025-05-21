// External libraries
import { Request, Response } from "express";

// Use case
import { ListAllDirectoriesUseCase } from "../../../../../application/use-cases/directory/listAll/ListAllDirectories.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./ListAllDirectories.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

export class ListAllDirectoriesController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listAllDirectoriesUseCase: ListAllDirectoriesUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    listAllDirectoriesUseCase: ListAllDirectoriesUseCase,
    tokenService: TokenProvider
  ) {
    return new ListAllDirectoriesController(
      "/:id/directory",
      "get",
      listAllDirectoriesUseCase,
      tokenService
    );
  }

  /**
   * @swagger
   * /{id}/directory:
   *   get:
   *     summary: Lista todos os diretórios de um usuário
   *     tags: [Directory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário que possui os diretórios
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Lista de diretórios retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 directories:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                         example: "abc12345-def6-7890-gh12-ijklmnopqrst"
   *                       name:
   *                         type: string
   *                         example: "MeuDiretorio"
   *                       isTemplate:
   *                         type: boolean
   *                         example: false
   *       401:
   *         description: Não autorizado (token inválido ou ausente)
   *       500:
   *         description: Erro interno do servidor
   */
  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
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

      try {
        const restoreDirectories = await this.listAllDirectoriesUseCase.execute(
          {
            idUser,
          }
        );

        const output = presenter({
          directories: restoreDirectories.directories,
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
