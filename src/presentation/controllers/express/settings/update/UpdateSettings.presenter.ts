import { UpdateSettingsControllerOutputDTO } from "../../../../dtos/settings/update/controllersDTO";

export const presenter = (
  input: UpdateSettingsControllerOutputDTO
): UpdateSettingsControllerOutputDTO => {
  const response = {
    status: input.status,
  };
  return response;
};
