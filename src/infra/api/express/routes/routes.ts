import { Request, Response, NextFunction } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export const HttpMethod = {
  GET: "get" as HttpMethod,
  POST: "post" as HttpMethod,
  PUT: "put" as HttpMethod,
  PATCH: "patch" as HttpMethod,
  DELETE: "delete" as HttpMethod,
} as const;

export interface Route {
  getMiddlewares?(): (req: Request, res: Response, next: NextFunction) => void;
  getHandler(): (req: Request, res: Response) => Promise<void>;
  getPath(): string;
  getMethod(): HttpMethod;
}
