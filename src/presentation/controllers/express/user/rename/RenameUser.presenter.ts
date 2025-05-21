import { RenameUserControllerOutputDTO } from "../../../../dtos/user/rename/controllersDTO";

export const presenter = (
  input: RenameUserControllerOutputDTO
): RenameUserControllerOutputDTO => {
  const response = {
    idUser: input.idUser,
    newUsername: input.newUsername,
  };
  return response;
};
