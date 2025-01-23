import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { User } from '../models/user';

/**
 * Repository class for managing CRUD operations on the DynamoDB table for User entities.
 */
export class UserRepository {
  private client: DynamoDBClient;
  private tableName: string;

  /**
   * Creates an instance of the UserRepository.
   * @param client - An instance of DynamoDBClient.
   * @param tableName - The name of the DynamoDB table.
   */
  constructor(client: DynamoDBClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  /**
   * Creates a new user in the DynamoDB table.
   * @param user - The user object to be created.
   * @returns The created user object.
   * @throws Error if the operation fails.
   */
  async create(user: User): Promise<User> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(user),
    });

    await this.client.send(command);
    return user;
  }

  /**
   * Retrieves a user by their ID from the DynamoDB table.
   * @param id - The ID of the user to retrieve.
   * @returns The user object if found, or null if not found.
   * @throws Error if the operation fails.
   */
  async getById(id: string): Promise<User | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });

    const result = await this.client.send(command);
    return result.Item ? (unmarshall(result.Item) as User) : null;
  }

  /**
   * Updates a user's fields in the DynamoDB table.
   * @param id - The ID of the user to update.
   * @param updates - The fields to update with their new values.
   * @returns The updated user object, or null if the user does not exist.
   * @throws Error if the operation fails.
   */
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const reservedKeywords = ['name', 'status', 'type'];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expression = Object.keys(updates)
      .map((key, index) => {
        const attributeName = reservedKeywords.includes(key) ? `#key${index}` : key;
        expressionAttributeNames[attributeName] = key; // Mapeia o alias para o nome real
        return `${attributeName} = :val${index}`;
      })
      .join(', ');

    const expressionValues = marshall(
      Object.entries(updates).reduce(
        (acc, [key, value], index) => ({
          ...acc,
          [`:val${index}`]: value,
        }),
        {},
      ),
    );

    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
      UpdateExpression: `SET ${expression}`,
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await this.client.send(command);
    return result.Attributes ? (unmarshall(result.Attributes) as User) : null;
  }

  /**
   * Deletes a user by their ID from the DynamoDB table.
   * @param id - The ID of the user to delete.
   * @throws Error if the operation fails.
   */
  async delete(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    await this.client.send(command);
  }

  /**
   * Retrieves all users from the DynamoDB table.
   * @returns An array of all user objects in the table.
   * @throws Error if the operation fails.
   */
  async getAll(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const result = await this.client.send(command);
    return result.Items ? result.Items.map((item) => unmarshall(item) as User) : [];
  }
}
