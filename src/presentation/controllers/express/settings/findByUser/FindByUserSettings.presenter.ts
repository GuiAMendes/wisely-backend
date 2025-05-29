import { FindByUserSettingsControllerOutputDTO } from "../../../../dtos/settings/findByUser/controllersDTO";

export const presenter = (
  input: FindByUserSettingsControllerOutputDTO
): FindByUserSettingsControllerOutputDTO => {
  const response = {
    colorSchema: {
      primaryColor: input.colorSchema.primaryColor,
      secondaryColor: input.colorSchema.secondaryColor,
    },
  };
  return response;
};
