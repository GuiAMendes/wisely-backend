// External libraries
import { Request, Response } from "express";

// Use case
import { UpdateDateOfAccessJourneyUseCase } from "../../../../../application/use-cases/journey/updateDateOfAccess/UpdateDateOfAccessDirectory.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./UpdateDateOfAccessJourney.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class UpdateDateOfAccessJourneyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateDateOfAccessUseCase: UpdateDateOfAccessJourneyUseCase
  ) {}

  public static create(
    updateDateOfAccessUseCase: UpdateDateOfAccessJourneyUseCase
  ) {
    return new UpdateDateOfAccessJourneyController(
      "/journey/:id/updateLastAccess",
      "patch",
      updateDateOfAccessUseCase
    );
  }

  /**
   * @swagger
   * /journey/{id}/updateLastAccess:
   *   patch:
   *     summary: Atualiza a data do último acesso de uma jornada
   *     tags: [Journey]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada cujo último acesso será atualizado
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Data de acesso da jornada atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idJourney:
   *                   type: string
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *       401:
   *         description: Não autorizado (acesso negado)
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
      const { id: idJourney } = request.params;

      try {
        const updatedDirectory = await this.updateDateOfAccessUseCase.execute({
          idJourney,
        });

        const output = presenter({
          idJourney: updatedDirectory.idJourney,
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
