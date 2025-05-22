import { DeactivateDirectoryUseCaseOutputDTO } from "../../../../dtos/directory/deactivate/usecaseDTO";

export const presenter = (
  input: DeactivateDirectoryUseCaseOutputDTO
): DeactivateDirectoryUseCaseOutputDTO => {
  const response = {
    idDirectory: input.idDirectory,
    status: input.status,
  };
  return response;
};
