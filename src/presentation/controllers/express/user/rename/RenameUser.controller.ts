// External libraries
import { Request, Response } from "express";

// Use case
import { RenameUserUseCase } from "../../../../../application/use-cases/user/rename/RenameUser.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./RenameUser.presenter";

// Validator
import { isSafe } from "../../../../../domain/validator/user";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class RenameUserController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameUserUseCase: RenameUserUseCase
  ) {}

  public static create(renameUserUseCase: RenameUserUseCase) {
    return new RenameUserController(
      "/user/:id/rename",
      "patch",
      renameUserUseCase
    );
  }

  /**
   * @swagger
   * /user/{id}/rename:
   *   patch:
   *     summary: Altera o nome de usuário de um usuário existente
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário a ser renomeado
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
   *               - newUsername
   *             properties:
   *               newUsername:
   *                 type: string
   *                 example: novoUsuario123
   *     responses:
   *       200:
   *         description: Nome de usuário atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idUser:
   *                   type: string
   *                   format: uuid
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 username:
   *                   type: string
   *                   example: novoUsuario123
   *       400:
   *         description: Requisição malformada (username inválido ou perigoso)
   *       401:
   *         description: Não autorizado
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { newUsername } = request.body;
      const { id: idUser } = request.params;

      const checkUser = isSafe(newUsername);

      if (!checkUser) {
        response
          .status(400)
          .json({ error: "The new username is invalid or ansafety." });
        return;
      }

      try {
        const updatedUser = await this.renameUserUseCase.execute({
          idUser,
          newUsername,
        });

        const output = presenter({
          idUser: updatedUser.idUser,
          newUsername: updatedUser.username,
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
