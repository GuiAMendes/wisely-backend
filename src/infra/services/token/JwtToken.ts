// External libraries
import {
  sign as jwtSign,
  verify as jwtVerify,
  SignOptions,
  VerifyOptions,
  JwtPayload,
} from "jsonwebtoken";

import type { TokenProvider } from "./interfaces/token.interfaces";

export class JwtToken implements TokenProvider {
  sign(
    payload: string | Buffer | object,
    secret: string,
    options?: SignOptions
  ): string {
    return jwtSign(payload, secret, options);
  }

  verify(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): JwtPayload | string {
    return jwtVerify(token, secret, options);
  }
}
