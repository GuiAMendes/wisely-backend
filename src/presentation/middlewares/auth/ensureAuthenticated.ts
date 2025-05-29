// External libraries
import { NextFunction, Request, Response } from "express";

// Interfaces
import type { TokenProvider } from "../../../infra/services/token/interfaces/token.interfaces";

// Constants
import { SECRET_KEY } from "./constants.ts/auth.constants";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
  tokenProvider: TokenProvider
): void {
  const authToken = request.headers.authorization;

  if (!authToken) {
    response.status(401).json({ message: "Token is missing" });
    return;
  }

  const [, token] = authToken.split(" ");

  try {
    tokenProvider.verify(token, SECRET_KEY);
    next();
  } catch {
    response.status(401).json({ message: "Token invalid" });
  }
}
