// External libraries
import { Request, Response } from "express";

// Use case
import { CompleteJourneyUseCase } from "../../../../../application/use-cases/journey/complete/CompleteJourney.usecase";

// Interfaces
import { HttpMethod, Route } from "../../../../../infra/api/express/routes";

// Presenter
import { presenter } from "./CompleteJourney.presenter";

// Error
import { UnauthorizedError } from "../../../../errors/UnauthorizedError";

export class CompleteJourneyController implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly completeJourneyUseCase: CompleteJourneyUseCase
  ) {}

  public static create(completeJourneyUseCase: CompleteJourneyUseCase) {
    return new CompleteJourneyController(
      "/journey/:id/complete",
      "patch",
      completeJourneyUseCase
    );
  }

  /**
   * @swagger
   * /journey/{id}/complete:
   *   patch:
   *     summary: Marca uma jornada como concluída
   *     tags: [Journey]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da jornada a ser concluída
   *         schema:
   *           type: string
   *           format: uuid
   *           example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: Jornada marcada como concluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 idJourney:
   *                   type: string
   *                   example: 123e4567-e89b-12d3-a456-426614174000
   *                 status:
   *                   type: string
   *                   example: completed
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
        const updatedJourney = await this.completeJourneyUseCase.execute({
          idJourney,
        });

        const output = presenter({
          idJourney: updatedJourney.idJourney,
          status: updatedJourney.status,
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
