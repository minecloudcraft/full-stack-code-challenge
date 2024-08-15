### 5. Criar Tabela se Não Existir

Se a tabela realmente não existir, você precisará criá-la. Aqui está um exemplo de como criar uma tabela no DynamoDB usando AWS CLI:

bash
Copiar código
aws dynamodb create-table \
 --table-name GameSessions \
 --attribute-definitions AttributeName=SessionId,AttributeType=S \
 --key-schema AttributeName=SessionId,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region us-west-1

### DynamoDB Local

Se estiver usando o DynamoDB Local, você pode usar a AWS CLI apontando para o endpoint local:

aws dynamodb scan --table-name GameSessions --endpoint-url http://localhost:8000
