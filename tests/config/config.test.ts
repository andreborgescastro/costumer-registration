import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserRepository } from '../../src/repository/userRepository';
import { UserService } from '../../src/services/userService';
import { createDependencies } from '../../src/config/dependencies';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('../../src/repository/userRepository');
jest.mock('../../src/services/userService');

describe('createDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create dependencies with correct parameters', () => {
    process.env.REGION = 'us-east-1';
    process.env.USERS_TABLE_NAME = 'UsersTable';

    const mockDynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
    (DynamoDBClient as jest.Mock).mockImplementation(() => mockDynamoDBClient);

    const { userService } = createDependencies();

    expect(DynamoDBClient).toHaveBeenCalledWith({ region: 'us-east-1' });

    expect(UserRepository).toHaveBeenCalledWith(mockDynamoDBClient, 'UsersTable');

    expect(UserService).toHaveBeenCalledWith(expect.any(UserRepository));

    expect(userService).toBeInstanceOf(UserService);
  });
});
