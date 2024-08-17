import { deleteSession } from "../../../src/handlers/deleteSession.mjs";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { jest } from "@jest/globals";

const ddbMock = mockClient(DynamoDBClient);

describe("deleteSession", () => {
  let req;
  let res;

  beforeEach(() => {
    ddbMock.reset(); // Reseta o mock antes de cada teste
    req = {
      params: { sessionId: "12345" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("deve deletar a sessão com sucesso", async () => {
    ddbMock.on(DeleteItemCommand).resolves({}); // Mock para uma resposta bem-sucedida

    await deleteSession(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Session deleted successfully",
    });
  });

  it("deve retornar 400 se o sessionId não for fornecido", async () => {
    req.params.sessionId = undefined; // Simula a ausência de sessionId

    await deleteSession(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "SessionId is required" });
  });

  it("deve retornar 500 em caso de erro no DynamoDB", async () => {
    ddbMock.on(DeleteItemCommand).rejects(new Error("Erro no DynamoDB"));

    await deleteSession(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Erro no DynamoDB",
    });
  });
});
