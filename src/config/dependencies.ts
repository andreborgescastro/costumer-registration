import { UserService } from '../services/userService';
import { UserRepository } from '../repository/userRepository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const createDependencies = () => {
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const userRepository = new UserRepository(client, process.env.USERS_TABLE_NAME || '');
  return {
    userService: new UserService(userRepository),
  };
};
