// External libraries
import { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";

export interface TokenProvider {
  sign(
    payload: string | Buffer | object,
    secret: string,
    options?: SignOptions
  ): string;

  verify(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): JwtPayload | string;
}
