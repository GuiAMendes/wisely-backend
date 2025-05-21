import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wisely API",
      version: "1.0.0",
      description: "Documentação da API do sistema Wisely",
    },
    tags: [
      {
        name: "Auth",
        description: "Operações de autenticação",
      },
      {
        name: "User",
        description: "Gerenciamento de usuários",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/presentation/controllers/express/**/*.ts"],
});
