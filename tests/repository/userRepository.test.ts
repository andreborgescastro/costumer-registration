import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { UserRepository } from '../../src/repository/userRepository';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { User } from '../../src/models/user';

jest.mock('@aws-sdk/client-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-dynamodb');
  return {
    ...originalModule,
    PutItemCommand: jest.fn(),
  };
});
jest.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: jest.fn(),
  unmarshall: jest.fn((data) => data),
}));

describe('UserRepository', () => {
  let client: jest.Mocked<DynamoDBClient>;
  let repository: UserRepository;
  const tableName = 'test-table';

  beforeEach(() => {
    client = new DynamoDBClient({}) as jest.Mocked<DynamoDBClient>;
    client.send = jest.fn();
    repository = new UserRepository(client, tableName);
  });

  describe('create', () => {
    it('should create a user in the table', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        addressList: [],
        contactList: [],
        birthdate: '1990-01-01',
        status: 'active',
      };

      (marshall as jest.Mock).mockReturnValue({
        id: { S: '1' },
        name: { S: 'John Doe' },
        addressList: { L: [] },
        contactList: { L: [] },
        birthdate: { S: '1990-01-01' },
        status: { S: 'active' },
      });

      const mockPutItemCommand = jest.fn();
      (PutItemCommand as unknown as jest.Mock).mockImplementation(mockPutItemCommand);

      client.send.mockResolvedValueOnce({} as never);

      await repository.create(user);

      expect(mockPutItemCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Item: {
          id: { S: '1' },
          name: { S: 'John Doe' },
          addressList: { L: [] },
          contactList: { L: [] },
          birthdate: { S: '1990-01-01' },
          status: { S: 'active' },
        },
      });

      expect(client.send).toHaveBeenCalledWith(expect.any(PutItemCommand));
    });

    it('should throw an error if creation fails', async () => {
      (client.send as jest.Mock).mockRejectedValueOnce(new Error('DynamoDB error'));

      await expect(
        repository.create({
          id: '1',
          name: 'John Doe',
          addressList: [],
          contactList: [],
          birthdate: '1990-01-01',
          status: 'active',
        }),
      ).rejects.toThrow('DynamoDB error');
    });
  });

  describe('getById', () => {
    it('should retrieve a user by ID', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        addressList: [],
        contactList: [],
        birthdate: '',
        status: '',
      };
      client.send.mockResolvedValue({ Item: { mockItem: 'data' } } as never);
      (unmarshall as jest.Mock).mockReturnValue(user);

      const result = await repository.getById('1');

      expect(client.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      client.send.mockResolvedValue({ Item: undefined } as never);

      const result = await repository.getById('1');

      expect(client.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
      expect(result).toBeNull();
    });

    it('should throw an error if retrieval fails', async () => {
      client.send.mockRejectedValue(new Error('DynamoDB error') as never);

      await expect(repository.getById('1')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updates = { name: 'Updated Name' };
      const updatedUser: Partial<User> = { id: '1', name: 'Updated Name', addressList: [], contactList: [] };
      client.send.mockResolvedValue({ Attributes: { mockUpdated: 'data' } } as never);
      (unmarshall as jest.Mock).mockReturnValue(updatedUser);

      const result = await repository.update('1', updates);

      expect(client.send).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
      expect(result).toEqual(updatedUser);
    });

    it('should return null if the user does not exist', async () => {
      client.send.mockResolvedValue({ Attributes: undefined } as never);

      const result = await repository.update('1', { name: 'Non-existent' });

      expect(client.send).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
      expect(result).toBeNull();
    });

    it('should throw an error if update fails', async () => {
      client.send.mockRejectedValue(new Error('DynamoDB error') as never);

      await expect(repository.update('1', { name: 'Failing Update' })).rejects.toThrow('DynamoDB error');
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      client.send.mockResolvedValue({} as never);

      await repository.delete('1');

      expect(client.send).toHaveBeenCalledWith(expect.any(DeleteItemCommand));
    });

    it('should throw an error if deletion fails', async () => {
      client.send.mockRejectedValue(new Error('DynamoDB error') as never);

      await expect(repository.delete('1')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('getAll', () => {
    it('should retrieve all users', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'John Doe',
          addressList: [],
          contactList: [],
          birthdate: '',
          status: '',
        },
      ];
      client.send.mockResolvedValue({ Items: [{ mockItem: 'data' }] } as never);
      (unmarshall as jest.Mock).mockReturnValueOnce(users[0]);

      const result = await repository.getAll();

      expect(client.send).toHaveBeenCalledWith(expect.any(ScanCommand));
      expect(result).toEqual(users);
    });

    it('should return an empty array if no users are found', async () => {
      client.send.mockResolvedValue({ Items: undefined } as never);

      const result = await repository.getAll();

      expect(client.send).toHaveBeenCalledWith(expect.any(ScanCommand));
      expect(result).toEqual([]);
    });

    it('should throw an error if retrieval fails', async () => {
      client.send.mockRejectedValue(new Error('DynamoDB error') as never);

      await expect(repository.getAll()).rejects.toThrow('DynamoDB error');
    });
  });
});
