// Entity
import { Journey } from "../../../../domain/entity/journey/Journey";
import { JourneyType } from "../../../../domain/value-object/journey/TypeOfJourney";

// Interfaces
import type { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// UseCase
import type { Usecase } from "../../interface/usecase.interface";

// Gateway
import type { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

// DTOS
import type {
  CreateJourneyUseCaseInputDTO,
  CreateJourneyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateJourneyUseCase
  implements
    Usecase<CreateJourneyUseCaseInputDTO, CreateJourneyUseCaseOutputDTO>
{
  constructor(
    private readonly journeyGateway: JourneyGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(
    journeyGateway: JourneyGateway,
    uuidService: UuidGenerator
  ) {
    return new CreateJourneyUseCase(journeyGateway, uuidService);
  }

  async execute({
    name,
    idDirectory,
    typeOfJourney,
  }: CreateJourneyUseCaseInputDTO) {
    try {
      const journey = Journey.create({
        idDirectory,
        journeyName: name,
        typeOfJourney: typeOfJourney as JourneyType,
        uuidGenerator: this.uuidService,
      });

      await this.journeyGateway.create(journey);
      const output: CreateJourneyUseCaseOutputDTO = {
        id: journey.id,
        name: journey.journeyName,
        typeOfJourney: journey.typeOfJourney,
      };

      return output;
    } catch (error) {
      console.error("Error while creating journey:", error);
      throw new DatabaseError("Failed to create journey.");
    }
  }
}
