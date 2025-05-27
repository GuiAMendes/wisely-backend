import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { JourneyRepositoryPrisma } from "../infra/reporitory/prisma/journey/journey.repository";

import { CreateJourneyUseCase } from "../application/use-cases/journey/create/CreateJourney.usecase";
import { CreateJourneyController } from "../presentation/controllers/express/journey/create/CreateJourney.controller";

export function createJourneyControllers() {
  const journeyRepository = JourneyRepositoryPrisma.with(prisma);

  const create = CreateJourneyController.create(
    CreateJourneyUseCase.create(journeyRepository, uuidGenerator),
    jwtToken
  );

  return [create];
}
