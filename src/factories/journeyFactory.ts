import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { JourneyRepositoryPrisma } from "../infra/reporitory/prisma/journey/journey.repository";

import { CreateJourneyUseCase } from "../application/use-cases/journey/create/CreateJourney.usecase";
import { CreateJourneyController } from "../presentation/controllers/express/journey/create/CreateJourney.controller";

import { ListAllJourneysUseCase } from "../application/use-cases/journey/listAll/ListAllJourneys.usecase";
import { ListAllJourneysController } from "../presentation/controllers/express/journey/listAll/ListAllJourneys.controller";

import { ListAllJourneyAccessedRecentlyUseCase } from "../application/use-cases/journey/listRecents/ListAllJourneyAccessedRecently.usecase";
import { ListAllJourneyAccessedRecentlyController } from "../presentation/controllers/express/journey/listRecents/ListAllJourneysAccessedRecently.controller";

import { FindByNameJourneysUseCase } from "../application/use-cases/journey/findByName/FindByNameJourneys.usecase";
import { FindByNameJourneysController } from "../presentation/controllers/express/journey/findByName/FindByNameJourneys.controller";

import { UpdateDateOfAccessJourneyUseCase } from "../application/use-cases/journey/updateDateOfAccess/UpdateDateOfAccessDirectory.usecase";
import { UpdateDateOfAccessJourneyController } from "../presentation/controllers/express/journey/updateDate/UpdateDateOfAccessJourney.controller";

import { CompleteJourneyUseCase } from "../application/use-cases/journey/complete/CompleteJourney.usecase";
import { CompleteJourneyController } from "../presentation/controllers/express/journey/complete/CompleteJourney.controller";

import { DeactivateJourneyUseCase } from "../application/use-cases/journey/deactivate/DeactivateJourney.usecase";
import { DeactivateJourneyController } from "../presentation/controllers/express/journey/deactivate/DeactivateJourney.controller";

import { RenameJourneyUseCase } from "../application/use-cases/journey/rename/RenameJourney.usecase";
import { RenameJourneyController } from "../presentation/controllers/express/journey/rename/RenameJourney.controller";

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

  const listRecent = ListAllJourneyAccessedRecentlyController.create(
    ListAllJourneyAccessedRecentlyUseCase.create(journeyRepository),
    jwtToken
  );

  const findByName = FindByNameJourneysController.create(
    FindByNameJourneysUseCase.create(journeyRepository),
    jwtToken
  );

  const updateLastAccess = UpdateDateOfAccessJourneyController.create(
    UpdateDateOfAccessJourneyUseCase.create(journeyRepository)
  );

  const markAsComplete = CompleteJourneyController.create(
    CompleteJourneyUseCase.create(journeyRepository)
  );

  const deactivateDirectory = DeactivateJourneyController.create(
    DeactivateJourneyUseCase.create(journeyRepository)
  );

  const rename = RenameJourneyController.create(
    RenameJourneyUseCase.create(journeyRepository)
  );

  return [
    create,
    listAll,
    listRecent,
    findByName,
    updateLastAccess,
    markAsComplete,
    deactivateDirectory,
    rename,
  ];
}
