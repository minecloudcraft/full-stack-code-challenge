import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  getSession,
  getAllSessions,
} from "../../../src/handlers/getSession.mjs"; // Substitua "your-module" pelo caminho do seu arquivo.
import express from "express";
import request from "supertest";

const ddbMock = mockClient(DynamoDBClient);

describe("Game Sessions API", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.get("/sessions/:sessionId", getSession);
    app.get("/sessions", getAllSessions);
  });

  afterEach(() => {
    ddbMock.reset();
  });

  describe("getSession", () => {
    it("should return 200 and the session data when the session exists", async () => {
      const sessionId = "session-123";
      const mockData = {
        SessionId: { S: sessionId },
        GameName: { S: "Test Game" },
        Players: { L: [{ S: "Player1" }, { S: "Player2" }] },
        CreatedAt: { S: "2023-08-01T00:00:00.000Z" },
      };

      ddbMock.on(GetItemCommand).resolves({ Item: mockData });

      const response = await request(app).get(`/sessions/${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(unmarshall(mockData));
    });

    it("should return 404 when the session does not exist", async () => {
      const sessionId = "session-123";

      ddbMock.on(GetItemCommand).resolves({});

      const response = await request(app).get(`/sessions/${sessionId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Session not found" });
    });

    it("should return 500 on DynamoDB error", async () => {
      const sessionId = "session-123";

      ddbMock.on(GetItemCommand).rejects(new Error("DynamoDB error"));

      const response = await request(app).get(`/sessions/${sessionId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Could not retrieve game session",
      });
    });
  });

  describe("getAllSessions", () => {
    it("should return 200 and the list of sessions when sessions exist", async () => {
      const mockData = [
        {
          SessionId: { S: "session-123" },
          GameName: { S: "Test Game" },
          Players: { L: [{ S: "Player1" }, { S: "Player2" }] },
          CreatedAt: { S: "2023-08-01T00:00:00.000Z" },
        },
        {
          SessionId: { S: "session-456" },
          GameName: { S: "Another Game" },
          Players: { L: [{ S: "Player3" }, { S: "Player4" }] },
          CreatedAt: { S: "2023-08-02T00:00:00.000Z" },
        },
      ];

      ddbMock.on(ScanCommand).resolves({ Items: mockData });

      const response = await request(app).get("/sessions");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData.map((item) => unmarshall(item)));
    });

    it("should return 404 when no sessions are found", async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [] });

      const response = await request(app).get("/sessions");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "No sessions found" });
    });

    it("should return 500 on DynamoDB error", async () => {
      ddbMock.on(ScanCommand).rejects(new Error("DynamoDB error"));

      const response = await request(app).get("/sessions");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Could not retrieve game sessions",
      });
    });
  });
});
