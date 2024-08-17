import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
});

const tableName = process.env.TABLE_NAME || "GameSessions";

/**
 * @openapi
 * /sessions/{sessionId}:
 *   get:
 *     summary: Recupera uma sessão de jogo existente
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Sessão de jogo recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SessionId:
 *                   type: string
 *                 GameName:
 *                   type: string
 *                 Players:
 *                   type: array
 *                   items:
 *                     type: string
 *                 CreatedAt:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: Sessão não encontrada
 *       '500':
 *         description: Erro ao recuperar sessão de jogo
 */
export const getSession = async (req, res) => {
  const { sessionId } = req.params;

  const params = {
    TableName: tableName,
    Key: marshall({ SessionId: sessionId }),
  };

  try {
    const command = new GetItemCommand(params);
    const data = await client.send(command);
    if (data.Item) {
      res.status(200).json(unmarshall(data.Item));
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Could not retrieve game session" });
  }
};

/**
 * @openapi
 * /sessions:
 *   get:
 *     summary: Recupera todas as sessões de jogo
 *     responses:
 *       '200':
 *         description: Lista de sessões de jogo recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   SessionId:
 *                     type: string
 *                   GameName:
 *                     type: string
 *                   Players:
 *                     type: array
 *                     items:
 *                       type: string
 *                   CreatedAt:
 *                     type: string
 *                     format: date-time
 *       '500':
 *         description: Erro ao recuperar sessões de jogo
 */
export const getAllSessions = async (req, res) => {
  const params = {
    TableName: tableName,
  };

  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);
    if (data.Items && data.Items.length > 0) {
      // Verifique se Items não está vazio
      res.status(200).json(data.Items.map((item) => unmarshall(item)));
    } else {
      res.status(404).json({ error: "No sessions found" });
    }
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).json({ error: "Could not retrieve game sessions" });
  }
};
