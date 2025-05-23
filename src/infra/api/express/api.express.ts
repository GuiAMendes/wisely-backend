// External libraries
import express, { Express } from "express";
import cors from "cors";

// Interfaces
import type { Route } from "./routes";
import type { API } from "../interfaces";

export class ApiExpress implements API {
  private app: Express;

  private constructor(routes: Route[]) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
      })
    );
    this.addRoutes(routes);
  }

  public static create(routes: Route[]) {
    return new ApiExpress(routes);
  }

  private addRoutes(routes: Route[]) {
    routes.map((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();
      this.app[method](path, handler);
    });
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running in port ${port}...`);
    });
  }

  public getApp(): Express {
    return this.app;
  }
}
