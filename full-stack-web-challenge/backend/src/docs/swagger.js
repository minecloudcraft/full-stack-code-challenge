import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const app = express();

// Configuração do Swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Game Sessions API",
    version: "1.0.0",
    description: "API para criação e recuperação de sessões de jogos",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/handlers/*.mjs", "./src/handlers/*.js"], // Ajuste o caminho conforme necessário
};

const swaggerSpec = swaggerJSDoc(options);

// Usar o Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar a porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
