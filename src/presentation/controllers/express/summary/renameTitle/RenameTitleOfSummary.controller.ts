// External libraries
import { NextFunction, Request, Response } from "express";

// Use case
import { RenameTitleOfSummaryUseCase } from "../../../../../application/use-cases/summary/renameTitle/RenameTitleOfSummary.usecase";

// Interfaces
import type {
  HttpMethod,
  Route,
} from "../../../../../infra/api/express/routes";
import { TokenProvider } from "../../../../../infra/services/token/interfaces/token.interfaces";

// Middleware
import { ensureAuthenticated } from "../../../../middlewares/auth/ensureAuthenticated";

// Presenter
import { presenter } from "./RenameTitleOfSummary.presenter";

// Validator
import { isSafe } from "../../../../../shared/validators";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class RenameTitleOfSummaryController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly renameTitleOfSummaryUseCase: RenameTitleOfSummaryUseCase,
    private readonly tokenService: TokenProvider
  ) {}

  public static create(
    renameTitleOfSummaryUseCase: RenameTitleOfSummaryUseCase,
    tokenService: TokenProvider
  ) {
    return new RenameTitleOfSummaryController(
      "/summary/:id/renameTitle",
      "patch",
      renameTitleOfSummaryUseCase,
      tokenService
    );
  }

  getMiddlewares(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) =>
      ensureAuthenticated(req, res, next, this.tokenService);
  }

  /**
   * @swagger
   * /summary/{id}/renameTitle:
   *   patch:
   *     summary: Renomeia o título de um resumo
   *     tags: [Summary]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do resumo a ser renomeado
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
   *               - newTitle
   *             properties:
   *               newTitle:
   *                 type: string
   *                 description: Novo título para o resumo
   *                 example: Conceitos Básicos de Node.js
   *     responses:
   *       200:
   *         description: Título do resumo atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idSummary:
   *                   type: string
   *                   format: uuid
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 newTitle:
   *                   type: string
   *                   example: Conceitos Básicos de Node.js
   *       400:
   *         description: Título inválido ou potencialmente perigoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: The new title of summary is invalid or ansafety.
   *       401:
   *         description: Não autorizado (token ausente ou inválido)
   *       500:
   *         description: Erro interno do servidor
   */

  getHandler() {
    return async (request: Request, response: Response) => {
      const { newTitle } = request.body;
      const { id: idSummary } = request.params;

      const checkSummary = isSafe(newTitle);

      if (!checkSummary) {
        response
          .status(400)
          .json({ error: "The new title of summary is invalid or ansafety." });
        return;
      }

      try {
        const updatedDirectory = await this.renameTitleOfSummaryUseCase.execute(
          {
            idSummary,
            newTitle,
          }
        );

        const output = presenter({
          idSummary: updatedDirectory.idSummary,
          newTitle: updatedDirectory.title,
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
