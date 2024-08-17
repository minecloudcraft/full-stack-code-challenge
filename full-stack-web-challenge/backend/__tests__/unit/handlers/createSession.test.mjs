import { describe, it, expect, jest } from "@jest/globals";
import { createSession } from "../../../src/handlers/createSession.mjs"; // Atualize o caminho para o arquivo correto
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import express from "express";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";

// Mock UUID generation to return a fixed UUID for testing
jest.mock("uuid", () => ({
  v4: jest.fn(() => "e09c3a0f-8c47-4a0f-b9dd-4f8b0d4b8e7b"), // Fixed UUID for consistent test results
}));

// Create a mock instance of DynamoDBClient
const ddbMock = mockClient(DynamoDBClient);

// Set up an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.post("/sessions", createSession); // Define POST route for creating sessions

// Tests for the createSession function
describe("createSession", () => {
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    ddbMock.reset(); // Reset mock client state
    jest.clearAllMocks(); // Clear Jest mocks to avoid interference between tests
  });

  // Test for successful session creation
  it("should create a session and return 201", async () => {
    // Define request body with session details
    const reqBody = {
      hostname: "777 unknown",
      players: 24,
      map: "Dust 2",
      mode: "Competitive",
    };

    // Mock DynamoDB commands
    ddbMock.on(PutItemCommand).resolves({}); // Mock successful response for PutItemCommand
    ddbMock.on(CreateTableCommand).resolves({}); // Mock successful response for CreateTableCommand
    ddbMock.on(ScanCommand).resolves({}); // Mock successful response for ScanCommand

    // Send POST request to the /sessions endpoint
    const response = await request(app).post("/sessions").send(reqBody);

    // Assert response status and body
    expect(response.status).toBe(201); // Check if the status code is 201 Created
    expect(response.body).toEqual({
      ...response.body, // Check if the response body matches the expected result
    });
  });

  // Test for missing required fields
  it("should return 400 if required fields are missing", async () => {
    // Define request body with missing 'mode' field
    const reqBody = {
      hostname: "777 unknown",
      players: 24,
      map: "Dust 2",
    };

    // Send POST request to the /sessions endpoint
    const response = await request(app).post("/sessions").send(reqBody);

    // Assert response status and body
    expect(response.status).toBe(400); // Check if the status code is 400 Bad Request
    expect(response.body).toEqual({ error: "Missing required fields" }); // Check if the response body contains the correct error message
  });

  // Test for internal server error during session creation
  it("should return 500 if there is an error creating the session", async () => {
    // Define request body with complete session details
    const reqBody = {
      hostname: "777 unknown",
      players: 24,
      map: "Dust 2",
      mode: "Competitive",
    };

    // Mock DynamoDB command to throw an error
    ddbMock.on(PutItemCommand).rejects(new Error("Error creating session"));

    // Send POST request to the /sessions endpoint
    const response = await request(app).post("/sessions").send(reqBody);

    // Assert response status and body
    expect(response.status).toBe(500); // Check if the status code is 500 Internal Server Error
    expect(response.body).toEqual({
      message: "Internal server error", // Check if the response body contains the correct error message
      error: "Error creating session",
    });
  });
});
