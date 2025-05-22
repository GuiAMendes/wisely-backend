// External libraries
import { Request, Response } from "express";

// Use case
import { UpdateDateOfAccessDirectoryUseCase } from "../../../../../application/use-cases/directory/updateDateOfAccess/UpdateDateOfAccessDirectory.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./UpdateDateOfAccessDirectory.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class UpdateDateOfAccessDirectoryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateDateOfAccessUseCase: UpdateDateOfAccessDirectoryUseCase
  ) {}

  public static create(
    updateDateOfAccessUseCase: UpdateDateOfAccessDirectoryUseCase
  ) {
    return new UpdateDateOfAccessDirectoryController(
      "/directory/:id/updateLastAccess",
      "patch",
      updateDateOfAccessUseCase
    );
  }

  /**
   * @swagger
   * /directory/{id}/updateLastAccess:
   *   patch:
   *     summary: Atualiza a data de último acesso de um diretório
   *     tags: [Directory]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do diretório
   *         schema:
   *           type: string
   *           format: uuid
   *           example: a1b2c3d4-e5f6-7890-abcd-1234567890ef
   *     responses:
   *       200:
   *         description: Data de acesso atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idDirectory:
   *                   type: string
   *                   format: uuid
   *                   example: a1b2c3d4-e5f6-7890-abcd-1234567890ef
   *       401:
   *         description: Não autorizado
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
      const { id: idDirectory } = request.params;

      try {
        const updatedDirectory = await this.updateDateOfAccessUseCase.execute({
          idDirectory,
        });

        const output = presenter({
          idDirectory: updatedDirectory.idDirectory,
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
