import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid"; // Importe o UUID
import { mockClient } from "aws-sdk-client-mock";
import { updateSession } from "../../../src/handlers/updateSession.mjs";
import { jest } from "@jest/globals";

// Create a mock instance of DynamoDBClient
const ddbMock = mockClient(DynamoDBClient);

// Test suite for the updateSession function
describe("updateSession", () => {
  // Reset mocks before each test to ensure a clean state
  beforeEach(() => {
    ddbMock.reset(); // Reset mock client state
  });

  // Test for missing sessionId in the request
  it("should return 400 if sessionId is not provided", async () => {
    // Mock request and response objects
    const req = { params: {}, body: {} }; // Request with no sessionId
    const res = {
      status: jest.fn().mockReturnThis(), // Mock response status method
      json: jest.fn(), // Mock response json method
    };

    // Call the updateSession function
    await updateSession(req, res);

    // Assert that the response status is 400 Bad Request
    expect(res.status).toHaveBeenCalledWith(400);
    // Assert that the response body contains the correct error message
    expect(res.json).toHaveBeenCalledWith({ error: "SessionId is required" });
  });

  // Test for successful session update
  it("should update session successfully", async () => {
    const sessionId = uuidv4(); // Generate a UUID v4 for the session
    // Mock request with sessionId and update details
    const req = {
      params: { sessionId },
      body: {
        hostname: "new-hostname",
        players: 5,
        map: "new-map",
        mode: "new-mode",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(), // Mock response status method
      json: jest.fn(), // Mock response json method
    };

    // Mock DynamoDB GetItemCommand to return existing session data
    ddbMock.on(GetItemCommand).resolves({
      Item: marshall({
        SessionId: sessionId,
        Hostname: "old-hostname",
        Players: 2,
        Map: "old-map",
        Mode: "old-mode",
      }),
    });

    // Mock DynamoDB UpdateItemCommand to return updated session data
    ddbMock.on(UpdateItemCommand).resolves({
      Attributes: marshall({
        Hostname: "new-hostname",
        Players: 5,
        Map: "new-map",
        Mode: "new-mode",
        UpdatedAt: new Date().toISOString(), // Update to reflect current date and time
      }),
    });

    // Call the updateSession function
    await updateSession(req, res);

    // Define expected response object
    const expectedResponse = {
      message: "Session updated successfully",
      data: {
        Hostname: { S: "new-hostname" },
        Players: { N: "5" },
        Map: { S: "new-map" },
        Mode: { S: "new-mode" },
        UpdatedAt: {
          S: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
          ), // Ensure UpdatedAt is a valid ISO 8601 date string
        },
      },
    };

    // Assert that the response status is 200 OK
    expect(res.status).toHaveBeenCalledWith(200);
    // Assert that the response body matches the expected response
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    );
  });

  // Test for handling errors during session update
  it("should handle errors and return 500", async () => {
    // Mock request with a sessionId but no update details
    const req = { params: { sessionId: "123" }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(), // Mock response status method
      json: jest.fn(), // Mock response json method
    };

    // Mock DynamoDB GetItemCommand to throw an error
    ddbMock.on(GetItemCommand).rejects(new Error("Some error"));

    // Call the updateSession function
    await updateSession(req, res);

    // Assert that the response status is 500 Internal Server Error
    expect(res.status).toHaveBeenCalledWith(500);
    // Assert that the response body contains the correct error message
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Some error",
    });
  });
});
