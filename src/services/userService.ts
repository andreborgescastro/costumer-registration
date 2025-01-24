import { randomUUID } from 'crypto';
import { User } from '../models/user';
import { UserRepository } from '../repository/userRepository';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async create(user: User): Promise<User> {
    try {
      const newUser = this.generateId(user);
      return await this.repository.create(newUser);
    } catch (error) {
      console.error(`Id: ${user.id} - Error creating user:, ${error}`);
      throw new Error('Failed to create user');
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return this.repository.getAll();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }

  getById(id: string): Promise<User | null> {
    try {
      return this.repository.getById(id);
    } catch (error) {
      console.error(`Id: ${id} - Error getting user:, ${error}`);
      throw new Error('Failed to get user');
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await this.repository.update(id, updates);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'ConditionalCheckFailedException' || (error as any).__type?.includes('ConditionalCheckFailedException'))
      ) {
        console.error(`Id: ${id} - Conditional check failed: The item does not exist or does not meet the condition.`);
        return null;
      }
      console.error(`Id: ${id} - Error updating user:, ${error}`);
      throw new Error('Failed to update user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error(`Id: ${id} - Error deleting user:, ${error}`);
      throw new Error('Failed to delete user');
    }
  }

  generateId(user: User): User {
    const generateListWithIds = (list: Array<any> = []) => list.map((item) => ({ ...item, id: randomUUID() }));
    const newUser = {
      ...user,
      id: randomUUID(),
      addressList: generateListWithIds(user.addressList),
      contactList: generateListWithIds(user.contactList),
    };

    return newUser;
  }
}
