import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { FlashcardRepositoryPrisma } from "../infra/reporitory/prisma/flashcard/flashcard.repository";

import { CreateFlashcardController } from "../presentation/controllers/express/flashcard/create/CreateFlashcard.controller";
import { CreateFlashcardUseCase } from "../application/use-cases/flashcard/create/CreateFlashcard.usecase";

import { ListAllFlashcardsController } from "../presentation/controllers/express/flashcard/listAll/ListAllFiles.controller";
import { ListAllFlashcardsUseCase } from "../application/use-cases/flashcard/listAll/ListAllFlashcards.usecase";

import { UpdateQuestionOfFlashcardUseCaseController } from "../presentation/controllers/express/flashcard/updateQuestion/UpdateQuestionOfFlashcard.controller";
import { UpdateQuestionOfFlashcardUseCase } from "../application/use-cases/flashcard/updateQuestion/UpdateQuestionOfFlashcard.usecase";

import { UpdateResponseOfFlashcardUseCaseController } from "../presentation/controllers/express/flashcard/updateResponse/UpdatResponseOfFlashcard.controller";
import { UpdateResponseOfFlashcardUseCase } from "../application/use-cases/flashcard/updateResponse/UpdateResponseOfFlashcard.usecase";
import { DeactivateFlashcardController } from "../presentation/controllers/express/flashcard/deactivate/DeactivateJourney.controller";
import { DeactivateFlashcardUseCase } from "../application/use-cases/flashcard/deactivate/DeactivateFlashcard.usecase";

export function createFlashcardControllers() {
  const flashcardRepository = FlashcardRepositoryPrisma.with(prisma);

  const create = CreateFlashcardController.create(
    CreateFlashcardUseCase.create(flashcardRepository, uuidGenerator),
    jwtToken
  );

  const listAll = ListAllFlashcardsController.create(
    ListAllFlashcardsUseCase.create(flashcardRepository),
    jwtToken
  );

  const updateQuestion = UpdateQuestionOfFlashcardUseCaseController.create(
    UpdateQuestionOfFlashcardUseCase.create(flashcardRepository),
    jwtToken
  );

  const updateResponse = UpdateResponseOfFlashcardUseCaseController.create(
    UpdateResponseOfFlashcardUseCase.create(flashcardRepository),
    jwtToken
  );

  const deactivate = DeactivateFlashcardController.create(
    DeactivateFlashcardUseCase.create(flashcardRepository),
    jwtToken
  );

  return [create, listAll, updateQuestion, updateResponse, deactivate];
}
