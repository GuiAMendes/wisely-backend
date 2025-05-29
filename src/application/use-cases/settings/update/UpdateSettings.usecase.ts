// Service
import type { SettingsGateway } from "../../../../domain/gateway/settings/settings.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  UpdateSettingsUseCaseInputDTO,
  UpdateSettingsUseCaseOutputDTO,
} from "../../../../presentation/dtos/settings/update/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { SettingValidator } from "../../../../domain/validator/setting/setting.validator";

export class UpdateSettingsUseCase
  implements
    Usecase<UpdateSettingsUseCaseInputDTO, UpdateSettingsUseCaseOutputDTO>
{
  constructor(private readonly SettingsGateway: SettingsGateway) {}

  public static create(SettingsGateway: SettingsGateway) {
    return new UpdateSettingsUseCase(SettingsGateway);
  }

  async execute({ idUser, colorSchema }: UpdateSettingsUseCaseInputDTO) {
    try {
      const { primaryColor, secondaryColor } = colorSchema;
      if (
        SettingValidator.isHexColor(primaryColor) ||
        SettingValidator.isHexColor(secondaryColor)
      )
        await this.SettingsGateway.updateColorSchema(idUser, colorSchema);
      const output: UpdateSettingsUseCaseOutputDTO = { status: "Success" };

      return output;
    } catch (error) {
      console.error("Error while update user settings:", error);
      throw new DatabaseError("Failed to updating user settings.");
    }
  }
}
