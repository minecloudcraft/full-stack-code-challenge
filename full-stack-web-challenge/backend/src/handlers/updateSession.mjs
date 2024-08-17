/**
 * @openapi
 * /sessions/{sessionId}:
 *   patch:
 *     summary: Update a game session by ID
 *     description: Update the details of a specific game session using its session ID.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: The ID of the session to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDoHost:
 *                 type: string
 *                 example: "Servidor Secundário"
 *               jogadores:
 *                 type: integer
 *                 example: 15
 *               mapa:
 *                 type: string
 *                 example: "Mapa da Floresta"
 *               modo:
 *                 type: string
 *                 example: "Casual"
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session updated successfully"
 *       404:
 *         description: Session not found
 *       400:
 *         description: SessionId is required
 *       500:
 *         description: Internal server error
 */
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000", // Certifique-se de que este é o endpoint correto
});

const tableName = process.env.TABLE_NAME || "GameSessions";

export const updateSession = async (req, res) => {
  const { sessionId } = req.params;
  const { hostname, players, map, mode } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "SessionId is required" });
  }

  // Verificar se a sessão existe
  const getParams = {
    TableName: tableName,
    Key: marshall({ SessionId: sessionId }),
  };

  try {
    console.log("Getting item with params:", getParams);
    const getCommand = new GetItemCommand(getParams);
    const result = await client.send(getCommand);

    if (!result.Item) {
      console.log("Session not found");
      return res.status(404).json({ error: "Session not found" });
    }

    const existingItem = unmarshall(result.Item);

    // Atualizar campos se fornecidos
    const updateParams = {
      TableName: tableName,
      Key: marshall({ SessionId: sessionId }),
      UpdateExpression:
        "SET #hostname = :hostname, #players = :players, #map = :map, #mode = :mode, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#hostname": "Hostname",
        "#players": "Players",
        "#map": "Map",
        "#mode": "Mode",
        "#updatedAt": "UpdatedAt",
      },
      ExpressionAttributeValues: marshall({
        ":hostname": hostname || existingItem.Hostname,
        ":players": players || existingItem.Players,
        ":map": map || existingItem.Map,
        ":mode": mode || existingItem.Mode,
        ":updatedAt": new Date().toISOString(),
      }),
      ReturnValues: "UPDATED_NEW",
    };

    console.log("Update item with params:", updateParams);
    const updateCommand = new UpdateItemCommand(updateParams);
    const updateResult = await client.send(updateCommand);

    console.log("Update result:", updateResult);

    res.status(200).json({
      message: "Session updated successfully",
      data: updateResult.Attributes,
    });
  } catch (error) {
    console.error("Error in updateSession:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
