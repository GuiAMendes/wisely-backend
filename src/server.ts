import dotenv from "dotenv";
dotenv.config();

import { ApiExpress } from "./infra/api/express/api.express";
import { createUserControllers } from "./factories/userFactory";
import { createDirectoryControllers } from "./factories/directoryFactory";

const PORT = Number(process.env.PORT) || 3333;

function runApplication() {
  const controllers = [
    ...createUserControllers(),
    ...createDirectoryControllers(),
  ];

  const API = ApiExpress.create(controllers);
  API.start(PORT);
}

runApplication();
