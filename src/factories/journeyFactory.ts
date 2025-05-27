import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { JourneyRepositoryPrisma } from "../infra/reporitory/prisma/journey/journey.repository";

import { CreateJourneyUseCase } from "../application/use-cases/journey/create/CreateJourney.usecase";
import { CreateJourneyController } from "../presentation/controllers/express/journey/create/CreateJourney.controller";
import { ListAllJourneysController } from "../presentation/controllers/express/journey/listAll/ListAllJourneys.controller";
import { ListAllJourneysUseCase } from "../application/use-cases/journey/listAll/ListAllJourneys.usecase";

export function createJourneyControllers() {
  const journeyRepository = JourneyRepositoryPrisma.with(prisma);

  const create = CreateJourneyController.create(
    CreateJourneyUseCase.create(journeyRepository, uuidGenerator),
    jwtToken
  );

  const listAll = ListAllJourneysController.create(
    ListAllJourneysUseCase.create(journeyRepository),
    jwtToken
  );

  return [create, listAll];
}
