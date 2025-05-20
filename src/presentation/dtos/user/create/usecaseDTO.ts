export type CreateUserUseCaseInputDTO = {
  username: string;
  email: string;
  password: string;
};

export type CreateUserUseCaseOutputDTO = {
  id: string;
};
