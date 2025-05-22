import { UpdateDateOfAccessDirectoryUseCaseOutputDTO } from "../../../../dtos/directory/updateDate/usecaseDTO";

export const presenter = (
  input: UpdateDateOfAccessDirectoryUseCaseOutputDTO
): UpdateDateOfAccessDirectoryUseCaseOutputDTO => {
  const response = {
    idDirectory: input.idDirectory,
  };
  return response;
};
