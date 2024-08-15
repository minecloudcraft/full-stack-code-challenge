import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

// Configura o cliente do DynamoDB para usar o DynamoDB Local
const dynamoDBClient = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});

const run = async () => {
  try {
    const data = await dynamoDBClient.send(new ListTablesCommand({}));
    console.log("Tables:", data.TableNames);
  } catch (err) {
    console.error("Error", err);
  }
};

run();
