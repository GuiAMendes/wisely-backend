// Service
import type { SettingsGateway } from "../../../../domain/gateway/settings/settings.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  FindByUserSettingsUseCaseInputDTO,
  FindByUserSettingsUseCaseOutputDTO,
} from "../../../../presentation/dtos/settings/findByUser/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class FindByUserSettingsUseCase
  implements
    Usecase<
      FindByUserSettingsUseCaseInputDTO,
      FindByUserSettingsUseCaseOutputDTO
    >
{
  constructor(private readonly settingsGateway: SettingsGateway) {}

  public static create(settingsGateway: SettingsGateway) {
    return new FindByUserSettingsUseCase(settingsGateway);
  }

  async execute({ idUser }: FindByUserSettingsUseCaseInputDTO) {
    try {
      const setting = await this.settingsGateway.findByIdUser(idUser);

      const output: FindByUserSettingsUseCaseOutputDTO = {
        colorSchema: {
          primaryColor: setting?.primaryColor || "#FEDBE2",
          secondaryColor: setting?.secondaryColor || "#FF6158",
        },
      };

      return output;
    } catch (error) {
      console.error("Error while find user settings:", error);
      throw new DatabaseError("Failed to find user settings.");
    }
  }
}
