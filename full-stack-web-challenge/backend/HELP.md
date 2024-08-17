### Codigos importantes no projeto

Comandos existentes no projetos
npm run create-table: cria uma tabela no banco de dado do DynamoDB chamado de "GameSessions"
npm run start: para executar o projeto usando nodemon
npm run test: mostra os testes unitarios feitos em cada arquivo ./src/handlers/todos_os_arquivo
npm run test:cov: mostrar a cobertura de teste de cada arquivo

### DynamoDB Local

Se estiver usando o DynamoDB Local, você pode usar a AWS CLI apontando para o endpoint local:

```
aws dynamodb scan --table-name GameSessions --endpoint-url http://localhost:8000
```

### Criar um container do DynamoDB localmente

Para usar o dynamoDB localmente com o docker, execute os seguintes passos:

1. Crie um docker-compose.yml, com as seguintes instruções

```
`version: "3.8"`
`services:`
  `dynamodb-local:`
    `command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"`
    `image: "amazon/dynamodb-local:latest"`
    `container_name: dynamodb-local`
    `ports:`
      `- "8000:8000"`
    `volumes:`
      `- "./docker/dynamodb:/home/dynamodblocal/data"`
    working_dir: /home/dynamodblocal
```

2. abra o seu terminal na raiz do projeto backend e execute o comando

```
docker-compose up -d
```

isso vai criar o container com o DynamoDB.
