// Service
import type { SettingsGateway } from "../../../../domain/gateway/settings/settings.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  CreateSettingsUseCaseInputDTO,
  CreateSettingsUseCaseOutputDTO,
} from "../../../../presentation/dtos/settings/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateSettingsUseCase
  implements
    Usecase<CreateSettingsUseCaseInputDTO, CreateSettingsUseCaseOutputDTO>
{
  constructor(private readonly SettingsGateway: SettingsGateway) {}

  public static create(SettingsGateway: SettingsGateway) {
    return new CreateSettingsUseCase(SettingsGateway);
  }

  async execute({ idUser }: CreateSettingsUseCaseInputDTO) {
    try {
      await this.SettingsGateway.create(idUser);
      const output: CreateSettingsUseCaseOutputDTO = { idUser: idUser };

      return output;
    } catch (error) {
      console.error("Error while creating user settings:", error);
      throw new DatabaseError("Failed to create user settings.");
    }
  }
}
