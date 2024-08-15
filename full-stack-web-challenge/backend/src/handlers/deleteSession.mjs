/**
 * @openapi
 * /sessions/{sessionId}:
 *   delete:
 *     summary: Delete a game session by ID
 *     description: Remove a specific game session using its session ID.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: The ID of the session to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session deleted successfully"
 *       404:
 *         description: Session not found
 *       400:
 *         description: SessionId is required
 *       500:
 *         description: Internal server error
 */

import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb"; // Certifique-se de importar a função marshall

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000", // Certifique-se de que este é o endpoint correto
});

const tableName = process.env.TABLE_NAME || "GameSessions";

export const deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "SessionId is required" });
  }

  const params = {
    TableName: tableName,
    Key: marshall({ SessionId: sessionId }),
  };

  try {
    const deleteCommand = new DeleteItemCommand(params);
    await client.send(deleteCommand);

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSession:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
