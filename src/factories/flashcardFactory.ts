import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { FlashcardRepositoryPrisma } from "../infra/reporitory/prisma/flashcard/flashcard.repository";

import { CreateFlashcardController } from "../presentation/controllers/express/flashcard/create/CreateFlashcard.controller";
import { CreateFlashcardUseCase } from "../application/use-cases/flashcard/create/CreateFlashcard.usecase";

export function createFlashcardControllers() {
  const flashcardRepository = FlashcardRepositoryPrisma.with(prisma);

  const create = CreateFlashcardController.create(
    CreateFlashcardUseCase.create(flashcardRepository, uuidGenerator),
    jwtToken
  );

  return [create];
}
