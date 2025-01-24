# Customer Registration System - Serverless

## Overview

This project implements a simple customer registration system (CRUD) using REST APIs and a serverless architecture based on AWS Lambda, API Gateway, and DynamoDB. The application is developed in Node.js (v22.x) and TypeScript, following an object-oriented programming approach. The solution includes automated tests and no external dependencies other than the AWS SDK v3 (`@aws-sdk`).

## Features

- REST API to manage customer registration with the following fields:
  - Full name
  - Date of birth
  - Active/inactive status
  - List of addresses
  - List of contacts (at least one must be primary):
    - Email
    - Phone
- Serverless architecture using AWS Lambda, DynamoDB, and API Gateway.
- Tests included for full coverage.

---

## Table of Contents

1. [Project Initialization](#project-initialization)
2. [Environment Configuration (.env)](#environment-configuration-env)
3. [Deployment](#deployment)
   - [Injecting AWS Credentials](#injecting-aws-credentials)
4. [Running Offline](#running-offline)
5. [Test Coverage](#test-coverage)

---

## Project Initialization

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Compile TypeScript to JavaScript:

   ```bash
   yarn run build
   ```

4. Run tests to ensure everything is working:
   ```bash
   yarn run test
   ```

---

## Environment Configuration (.env)

To run the application, you need to configure environment variables in a `.env` file located in the project root. Below is an example configuration:

```env
SERVERLESS_ACCESS_KEY=your_access_key
REGION=us-east-1
USERS_TABLE_NAME=CustomerTable
```

- `REGION`: The AWS region where your resources are deployed.
- `USERS_TABLE_NAME`: Name of the DynamoDB table used for storing users data.
- `SERVERLESS_ACCESS_KEY`: The serverless api-key provided with the e-mail that delivered this project.

---

### Injecting AWS Credentials

Ensure that your AWS credentials are configured. You can do this by:

1. Using the AWS CLI to configure your credentials:

   ```bash
   aws configure
   ```

   Provide your access key, secret key, and default region.

2. Alternatively, export AWS credentials as environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=<your_access_key>
   export AWS_SECRET_ACCESS_KEY=<your_secret_key>
   export REGION=<your_region>
   ```

---

## Deploy

This project uses the Serverless Framework for deployment. Follow these steps to deploy the application:

1. Install the Serverless Framework globally (if not already installed):

   ```bash
   npm install -g serverless
   ```

2. Deploy the application:
   ```bash
   yarn run deploy
   ```
   Note: AWS credentials must be active in the terminal where the command is executed.

---

## Destroy

This project uses the Serverless Framework, which simplifies the management of cloud resources. To remove the application, simply destroy it:

1. Execute:
   ```bash
   yarn run destroy
   ```
   Note: AWS credentials must be active in the terminal where the command is executed.

---

## Running Offline

To test the application locally, but conecting to a real DynamoDB Table, you must:

1. [Injecting AWS Credentials](#injecting-aws-credentials)

2. Run:

   ```bash
   yarn run start:offline
   ```

The application will be available at `http://localhost:3000`.

Note: AWS credentials must be active in the terminal where the command is executed.

---

## Test Coverage

This project includes automated tests to ensure code quality and functionality.
We addded the coverage to the project, to make it easier to visualize, but you can always re-generated
it through the instructions below.

1. Run tests:

   ```bash
   yarn run test:coverage
   ```

2. A coverage report will be generated in the `coverage/` directory. Open the `index.html` file in a browser to view detailed test results.

---

## Additional Notes

- The DynamoDB table will be provisioned with a primary key named `id` (string) to store customer data.
- The deployment will automatically create the required resources (e.g., Lambda functions, API Gateway endpoints, and DynamoDB table).
- Ensure you follow AWS best practices for IAM roles and permissions to secure access to your resources.
- The project does not include authorizer to the api-gateway route, it is recommended to close your routes with API-KEY or Authorizer.

---

## Contact

If you encounter any issues or have questions, feel free to open an issue in the repository or contact me.
andreborgescastro@gmail.com

Thanks!
