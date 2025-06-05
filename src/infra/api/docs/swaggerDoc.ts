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
      {
        name: "Directory",
        description: "Gerenciamento de diretórios",
      },
      {
        name: "Journey",
        description: "Gerenciamento de jornadas",
      },
      {
        name: "Settings",
        description: "Gerenciamento de configurações da UI",
      },
      {
        name: "Progress",
        description: "Gerenciamento de progressão",
      },
      {
        name: "Topic",
        description: "Gerenciamento de tópico",
      },
      {
        name: "Summary",
        description: "Gerenciamento de resumo",
      },
      {
        name: "File",
        description: "Gerenciamento de arquivos",
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
