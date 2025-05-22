import { CompleteDirectoryUseCaseOutputDTO } from "../../../../dtos/directory/complete/usecaseDTO";

export const presenter = (
  input: CompleteDirectoryUseCaseOutputDTO
): CompleteDirectoryUseCaseOutputDTO => {
  const response = {
    idDirectory: input.idDirectory,
    status: input.status,
  };
  return response;
};
