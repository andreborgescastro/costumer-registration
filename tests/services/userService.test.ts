import { UserService } from '../../src/services/userService';
import { UserRepository } from '../../src/repository/userRepository';
import { User } from '../../src/models/user';

jest.mock('../../src/repository/userRepository');

describe('UserService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    userRepository = new UserRepository(null as any, 'test-table') as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  describe('create', () => {
    it('should create a user with a generated ID and save it in the repository', async () => {
      const user: User = {
        id: '',
        name: 'John Doe',
        addressList: [],
        contactList: [],
        birthdate: '1990-01-01',
        status: 'active',
      };
      const savedUser = { ...user, id: 'generated-id' };
      userRepository.create.mockResolvedValue(savedUser);

      const result = await userService.create(user);

      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
      expect(result).toEqual(savedUser);
    });

    it('should throw an error if repository create fails', async () => {
      const user: User = { id: '', name: 'John Doe', addressList: [], contactList: [], birthdate: '', status: '' };
      userRepository.create.mockRejectedValue(new Error('Repository error'));

      await expect(userService.create(user)).rejects.toThrow('Failed to create user');
      expect(userRepository.create).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return a list of users from the repository', async () => {
      const users: User[] = [{ id: '1', name: 'John Doe', addressList: [], contactList: [], birthdate: '', status: '' }];
      userRepository.getAll.mockResolvedValue(users);

      const result = await userService.getAll();

      expect(userRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should throw an error if repository getAll fails', async () => {
      userRepository.getAll.mockRejectedValue(new Error('Failed to get all users'));

      await expect(userService.getAll()).rejects.toThrow('Failed to get all users');
      expect(userRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a user by ID from the repository', async () => {
      const user: User = { id: '1', name: 'John Doe', addressList: [], contactList: [], birthdate: '', status: '' };
      userRepository.getById.mockResolvedValue(user);

      const result = await userService.getById('1');

      expect(userRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('should throw an error if repository getById fails', async () => {
      userRepository.getById.mockRejectedValue(new Error('Failed to get user'));

      await expect(userService.getById('1')).rejects.toThrow('Failed to get user');
      expect(userRepository.getById).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updates = { name: 'John Updated' };
      const updatedUser = { id: '1', ...updates, addressList: [], contactList: [], birthdate: '', status: '' };
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updates);

      expect(userRepository.update).toHaveBeenCalledWith('1', updates);
      expect(result).toEqual(updatedUser);
    });

    it('should return null if ConditionalCheckFailedException occurs', async () => {
      const error = new Error('ConditionalCheckFailedException');
      (error as any).__type = 'ConditionalCheckFailedException';
      userRepository.update.mockRejectedValue(error);

      const result = await userService.update('1', { name: 'Invalid Update' });

      expect(userRepository.update).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an error for other exceptions', async () => {
      userRepository.update.mockRejectedValue(new Error('Repository error'));

      await expect(userService.update('1', { name: 'Invalid Update' })).rejects.toThrow('Failed to update user');
      expect(userRepository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      userRepository.delete.mockResolvedValue();

      await userService.delete('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if repository delete fails', async () => {
      userRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(userService.delete('1')).rejects.toThrow('Failed to delete user');
      expect(userRepository.delete).toHaveBeenCalled();
    });
  });

  describe('generateId', () => {
    it('should generate a new ID for the user and its nested lists', () => {
      const user: User = {
        id: '',
        name: 'John Doe',
        addressList: [
          {
            id: '',
            street: 'Main St',
            city: '',
            state: '',
            country: '',
          },
        ],
        contactList: [
          {
            id: '',
            phone: '123456789',
            email: '',
          },
        ],
        birthdate: '',
        status: '',
      };

      const result = userService.generateId(user);

      expect(result.id).toBeDefined();
      expect(result.addressList[0].id).toBeDefined();
      expect(result.contactList[0].id).toBeDefined();
    });
  });
});
