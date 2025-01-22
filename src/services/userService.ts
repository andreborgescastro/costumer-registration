import { randomUUID } from 'crypto';
import { User } from '../models/user';
import { UserRepository } from '../repository/userRepository';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  private users: User[] = []; // emulate memory DB

  create(user: User): Promise<User> {
    const id = randomUUID();
    return this.repository.create({ ...user, id });
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
