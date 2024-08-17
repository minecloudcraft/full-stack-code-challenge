import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

// Configurar a região e o endpoint do DynamoDB Local
const client = new DynamoDBClient({
  region: "us-west-1",
  endpoint: "http://localhost:8000", // Certifique-se de que o endpoint esteja correto
});

const params = {
  TableName: "GameSessions",
  KeySchema: [
    { AttributeName: "SessionId", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "SessionId", AttributeType: "S" }, // 'S' indicates string type
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

const createTable = async () => {
  try {
    const command = new CreateTableCommand(params);
    const data = await client.send(command);
    console.log("Table created successfully:", data.TableDescription.TableName);
  } catch (err) {
    console.error("Error creating table:", err.message);
  }
};

createTable();
