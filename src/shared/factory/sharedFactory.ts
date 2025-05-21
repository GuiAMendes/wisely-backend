import { GenerateTokenProvider } from "../../infra/provider/token/GenerateTokenProvider";
import { Bcrypt } from "../../infra/services/cryptation/Bcrypt";
import { Prisma } from "../../infra/services/orm/prisma/Prisma";
import { JwtToken } from "../../infra/services/token/JwtToken";
import { CryptoUuidGenerator } from "../../infra/services/uuid/CryptoUuidGenerator";

export const prisma = Prisma.getInstance();

export const jwtToken = new JwtToken();
export const tokenProvider = new GenerateTokenProvider(jwtToken);
export const bcrypt = new Bcrypt();
export const uuidGenerator = new CryptoUuidGenerator();
