import express from "express";
import { createSession } from "./src/handlers/createSession.mjs";
import { getSession } from "./src/handlers/getSession.mjs";
import serverless from "@vendia/serverless-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(express.json());

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
  apis: ["./src/handlers/*.mjs"], // Ajuste o caminho conforme necessário
};

const swaggerSpec = swaggerJsdoc(options);

// Usar o Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Adiciona logs nas rotas
app.post("/sessions", async (req, res) => {
  try {
    console.log("POST /sessions called with body:", req.body);
    await createSession(req, res);
  } catch (error) {
    console.error("Error in POST /sessions:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/sessions/:sessionId", async (req, res) => {
  try {
    console.log("GET /sessions/:sessionId called with params:", req.params);
    await getSession(req, res);
  } catch (error) {
    console.error("Error in GET /sessions/:sessionId:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "lambda") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export const handler = serverless({ app });
