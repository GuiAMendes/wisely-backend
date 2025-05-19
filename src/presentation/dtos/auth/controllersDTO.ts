export type AuthUserControllerInputDTO = {
  email: string;
  password: string;
};

export type AuthUserControllerOutputDTO = {
  token: string;
};
