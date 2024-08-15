/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: Create a new game session
 *     description: Create a new session for a game with specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDoHost:
 *                 type: string
 *                 example: "Servidor Principal"
 *               jogadores:
 *                 type: integer
 *                 example: 10
 *               mapa:
 *                 type: string
 *                 example: "Mapa do Deserto"
 *               modo:
 *                 type: string
 *                 example: "Competitivo"
 *             required:
 *               - nomeDoHost
 *               - jogadores
 *               - mapa
 *               - modo
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SessionId:
 *                   type: string
 *                   example: "e09c3a0f-8c47-4a0f-b9dd-4f8b0d4b8e7b"
 *       400:
 *         description: Bad request if required fields are missing
 *       500:
 *         description: Internal server error
 *
 */
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
});

const tableName = process.env.TABLE_NAME || "GameSessions";

async function createTableIfNotExists(tableName) {
  try {
    const params = {
      TableName: tableName,
    };
    const command = new ScanCommand(params);
    await client.send(command);
    console.log(`Table ${tableName} exists.`);
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      const createTableParams = {
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: "SessionId", AttributeType: "S" },
        ],
        KeySchema: [{ AttributeName: "SessionId", KeyType: "HASH" }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      };
      const createTableCommand = new CreateTableCommand(createTableParams);
      await client.send(createTableCommand);
      console.log(`Table ${tableName} created.`);
    } else {
      console.error("Error listing tables:", error.message);
      throw error;
    }
  }
}

export const createSession = async (req, res) => {
  await createTableIfNotExists(tableName);
  console.log("Received request:", req.body);
  const sessionId = uuidv4();
  const { nomeDoHost, jogadores, mapa, modo } = req.body;

  if (!nomeDoHost || !jogadores || !mapa || !modo) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const params = {
    TableName: tableName,
    Item: marshall({
      SessionId: sessionId,
      NomeDoHost: nomeDoHost,
      Jogadores: jogadores,
      Mapa: mapa,
      Modo: modo,
      CreatedAt: new Date().toISOString(),
    }),
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Creating session with data:", {
      nomeDoHost,
      jogadores,
      mapa,
      modo,
    });

    res.status(201).json({ SessionId: sessionId });
  } catch (error) {
    console.error("Error in createSession:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
