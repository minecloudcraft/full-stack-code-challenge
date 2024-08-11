# Full-Stack Developer Code Challenge

## Overview

Welcome to the Full-Stack Developer Code Challenge! In this challenge, you'll create two projects:

1. A front-end application using **React** and **Vite**.
2. A back-end application using **AWS Serverless Application Model (SAM)**.

Your task is to develop a form on the front-end that allows users to create a new game session, which will be persisted in a DynamoDB table via a RESTful API built in the back-end. Once the session is created, the user should be redirected to a list of all game sessions.

### General Guidelines

- **Code Quality**: Ensure your code is clean, well-structured, and follows best practices.
- **Documentation**: Provide clear instructions for running and deploying your applications.
- **Version Control**: Use Git for version control and commit your code to a public GitHub repository.

## Part 1: Front-End Project

### Objective

Create a React application with Vite that includes:

- A form for creating a new game session.
- A list view displaying all game sessions.
- Interaction with the back-end to persist data.

### Requirements

1. **Form**:
   - Collect the following game session details: `hostname`, `players`, `map`, and `mode`.
   - On submission, send a POST request to the back-end API to create a game session.

2. **List View**:
   - Fetch and display a list of game sessions from the back-end API.
   - Show details like `hostname`, `players`, `map`, and `mode`.

3. **User Experience (UX/UI)**:
   - Implement a responsive and user-friendly design.
   - Use a CSS framework or library of your choice (e.g., Tailwind CSS, Bootstrap).

4. **Code Quality**:
   - Ensure high code readability and maintainability.
   - Utilize modern React practices, such as hooks and functional components.

### Submission Guidelines

- Create a new GitHub repository for the front-end project.
- Include a `README.md` with instructions on how to run the application locally.
- Ensure your project is well-organized and follows best practices.

## Part 2: Back-End Project

### Objective

Develop an AWS Serverless application using SAM that provides a RESTful API for managing game sessions.

### Requirements

1. **RESTful API**:
   - Implement endpoints for creating and retrieving game sessions.
   - Use AWS API Gateway, AWS Lambda, and DynamoDB.

2. **Game Session Persistence**:
   - Store game session data in a DynamoDB table with fields: `sessionId` (UUID), `hostname`, `players`, `map`, and `mode`.

3. **Adherence to REST Principles**:
   - Design the API endpoints to follow REST conventions.

4. **Infrastructure as Code (IaC)**:
   - Use SAM to define and deploy your AWS resources.
   - Ensure your SAM template is well-structured and follows best practices.

5. **Unit Tests**:
   - Write unit tests for your Lambda functions using a framework like Jest or Mocha.

### Example API Endpoints

- **Create Game Session**: `POST /sessions`
  ```json
  {
    "hostname": "<hostname>",
    "players": <number_of_players>,
    "map": "<game_map>",
    "mode": "<game_mode>"
  }
  ```

- **List Game Sessions**: `GET /sessions`

### Submission Guidelines

- Create a separate GitHub repository for the back-end project.
- Include a `README.md` with instructions on how to deploy and test your application.
- Provide a `NOTES.md` detailing your approach, any assumptions made, and instructions on running your unit tests.

## Bonus Points

- Implement authentication for the API using AWS Cognito.
- Use GraphQL with AWS AppSync instead of REST for a more flexible API.
- Include end-to-end tests to ensure the entire workflow functions as expected.

## Evaluation Criteria

- **Front-End**:
  - UI/UX design and responsiveness.
  - Code quality and modern React practices.

- **Back-End**:
  - Adherence to REST principles.
  - Code quality and use of AWS services.
  - Effectiveness of IaC and unit tests.

- **Documentation**:
  - Clarity and completeness of instructions for running and deploying both applications.

---

Good luck, and we're excited to see your solutions! If you have any questions, feel free to reach out.
