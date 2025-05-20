export type CreateUserControllerInputDTO = {
  username: string;
  email: string;
  password: string;
};

export type CreateUserControllerOutputDTO = {
  id: string;
};
