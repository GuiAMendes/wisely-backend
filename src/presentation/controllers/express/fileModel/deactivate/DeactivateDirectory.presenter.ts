import { DeactivateFileUseCaseOutputDTO } from "../../../../dtos/fileModel/deactivate/usecaseDTO";

export const presenter = (
  input: DeactivateFileUseCaseOutputDTO
): DeactivateFileUseCaseOutputDTO => {
  const response = {
    idFile: input.idFile,
    status: input.status,
  };
  return response;
};
