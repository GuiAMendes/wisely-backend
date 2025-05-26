import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infra/api/docs/swaggerDoc";

import { ApiExpress } from "./infra/api/express/api.express";
import { createUserControllers } from "./factories/userFactory";
import { createDirectoryControllers } from "./factories/directoryFactory";
import { createJourneyControllers } from "./factories/journeyFactory";

const PORT = Number(process.env.PORT) || 3333;

function runApplication() {
  const controllers = [
    ...createUserControllers(),
    ...createDirectoryControllers(),
    ...createJourneyControllers(),
  ];

  const API = ApiExpress.create(controllers);

  API.getApp().use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  API.start(PORT);
}

runApplication();
