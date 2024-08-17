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
 *               hostname:
 *                 type: string
 *                 example: "777 unknown"
 *               players:
 *                 type: integer
 *                 example: 24
 *               map:
 *                 type: string
 *                 example: "Dust 2"
 *               mode:
 *                 type: string
 *                 example: "Competitive"
 *             required:
 *               - hostname
 *               - players
 *               - map
 *               - mode
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
  const { hostname, players, map, mode } = req.body;

  if (!hostname || !players || !map || !mode) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const params = {
    TableName: tableName,
    Item: marshall({
      SessionId: sessionId,
      Hostname: hostname,
      Players: players,
      Map: map,
      Mode: mode,
      CreatedAt: new Date().toISOString(),
    }),
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Creating session with data:", {
      hostname,
      players,
      map,
      mode,
    });

    res.status(201).json({ SessionId: sessionId });
  } catch (error) {
    console.error("Error in createSession:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
