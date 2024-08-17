import express from "express";
import { createSession } from "./src/handlers/createSession.mjs";
import { getSession } from "./src/handlers/getSession.mjs";
import { getAllSessions } from "./src/handlers/getSession.mjs";
import { updateSession } from "./src/handlers/updateSession.mjs"; // Importar o novo handler para atualização
import { deleteSession } from "./src/handlers/deleteSession.mjs"; // Importar o novo handler para exclusão
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
    description:
      "API para criação, recuperação, atualização e exclusão de sessões de jogos",
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

// Rota para criar uma nova sessão
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

// Rota para obter uma sessão por sessionId
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

// Rota para obter todas as sessões
app.get("/sessions", async (req, res) => {
  try {
    console.log("GET /sessions called");
    await getAllSessions(req, res);
  } catch (error) {
    console.error("Error in GET /sessions:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Rota para atualizar uma sessão por sessionId
app.patch("/sessions/:sessionId", async (req, res) => {
  try {
    console.log(
      "PATCH /sessions/:sessionId called with params:",
      req.params,
      "and body:",
      req.body
    );
    await updateSession(req, res); // Chama a função updateSession passando req e res
  } catch (error) {
    console.error("Error in PATCH /sessions/:sessionId:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Rota para deletar uma sessão por sessionId
app.delete("/sessions/:sessionId", async (req, res) => {
  try {
    console.log("DELETE /sessions/:sessionId called with params:", req.params);
    await deleteSession(req, res);
  } catch (error) {
    console.error("Error in DELETE /sessions/:sessionId:", error);
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
