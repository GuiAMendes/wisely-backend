import { AuthUserControllerOutputDTO } from "../../../../dtos/auth/controllersDTO";

export const presenter = (
  input: AuthUserControllerOutputDTO
): AuthUserControllerOutputDTO => {
  const response = {
    token: input.token,
  };
  return response;
};
