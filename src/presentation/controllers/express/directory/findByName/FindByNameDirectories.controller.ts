// External libraries
import { Request, Response } from "express";

// Use case
import { FindByNameDirectoriesUseCase } from "../../../../../application/use-cases/directory/findByName/FindByNameDirectories.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./FindByNameDirectories.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

// Validator
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";
import { isSafe } from "../../../../../shared/validators";

export class FindByNameDirectoriesController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findByNameDirectoriesUseCase: FindByNameDirectoriesUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    findByNameDirectoriesUseCase: FindByNameDirectoriesUseCase,
    tokenService: TokenProvider
  ) {
    return new FindByNameDirectoriesController(
      "/:id/directories",
      "get",
      findByNameDirectoriesUseCase,
      tokenService
    );
  }
  /**
   * @swagger
   * /{id}/directories:
   *   get:
   *     summary: Busca diretórios pelo nome para um usuário específico
   *     tags: [Directory]
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
   *           example: a1b2c3d4-e5f6-7890-abcd-1234567890ef
   *       - in: query
   *         name: name
   *         required: true
   *         description: Nome do diretório a ser buscado (filtro)
   *         schema:
   *           type: string
   *           example: MeusDocumentos
   *     responses:
   *       200:
   *         description: Lista de diretórios encontrados
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
   *                         example: d1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6
   *                       name:
   *                         type: string
   *                         example: MeusDocumentos
   *                       lastAccess:
   *                         type: string
   *                         format: date-time
   *                         example: 2025-05-21T14:30:00Z
   *       400:
   *         description: Requisição inválida (parâmetros ausentes ou mal formatados)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid name format.
   *       401:
   *         description: Não autorizado (token inválido ou expirado)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Token inválido ou expirado
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
      const { name: directoryName } = request.query;

      if (typeof directoryName !== "string") {
        response.status(400).json({ error: "Invalid name format." });
        return;
      }

      if (!directoryName) {
        response.status(400).json({ error: "Missing name to directory." });
        return;
      }

      const checkDirectoryName = isSafe(directoryName);

      if (!checkDirectoryName) {
        response.status(400).json({ error: "Name is invalid or danger." });
        return;
      }

      try {
        const restoreDirectories =
          await this.findByNameDirectoriesUseCase.execute({
            idUser,
            directoryName,
          });

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
