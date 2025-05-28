import { CreateSettingsControllerOutputDTO } from "../../../../dtos/settings/create/controllersDTO";

export const presenter = (
  input: CreateSettingsControllerOutputDTO
): CreateSettingsControllerOutputDTO => {
  const response = {
    idUser: input.idUser,
  };
  return response;
};
