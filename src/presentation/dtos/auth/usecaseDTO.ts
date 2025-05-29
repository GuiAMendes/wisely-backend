// Interfaces
import { Cryptation } from "../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import type { TokenProvider } from "../../../infra/services/token/interfaces/token.interfaces";

export type AuthUserUseCaseInputDTO = {
  email: string;
  password: string;
  cryptation: Cryptation;
  tokenGenerator: TokenProvider;
};

export type AuthUserUsecaseOutputDTO = {
  token: string;
};
