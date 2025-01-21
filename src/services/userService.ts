import { User } from "../models/user";

export class UserService {
  private users: User[] = []; // emulate memory DB

  async create(user: User): Promise<User> {
    user.id = (this.users.length + 1).toString();
    user.createdAt = new Date().toISOString();
    user.updatedAt = user.createdAt;
    this.users.push(user);
    return user;
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

    this.users[userIndex] = { ...this.users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
