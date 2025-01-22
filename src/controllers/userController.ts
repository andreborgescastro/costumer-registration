import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { successResponse, errorResponse } from '../utils/responseHelper';
import { validateObject } from '../utils/validator';
import { userSchema } from '../schemas/userSchema';
import { addressSchema } from '../schemas/addressSchema';
import { contactSchema } from '../schemas/contactSchema';

const userService = new UserService();

export const createUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userInput: User = JSON.parse(event.body || '{}');

    const validationErrors = validateObject(
      userInput,
      userSchema,
      {
        addressList: addressSchema,
        contactList: contactSchema,
      },
      ['id', 'contactList'],
    );

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) => `${error.field}: ${error.error}`).join('; ');
      return errorResponse(errorMessages, 400);
    }
    const newUser = await userService.create(userInput);
    return successResponse(newUser);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const getAllUsers: APIGatewayProxyHandlerV2 = async () => {
  try {
    const users = await userService.getAll();
    return successResponse(users);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const getUserById: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id || '';
    const user = await userService.getById(id);
    if (!user) return errorResponse('User not found', 404);
    return successResponse(user);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const updateUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id || '';
    const updates = JSON.parse(event.body || '{}');
    const updatedUser = await userService.update(id, updates);
    if (!updatedUser) return errorResponse('User not found', 404);
    return successResponse(updatedUser);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const deleteUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id || '';
    const deleted = await userService.delete(id);
    if (!deleted) return errorResponse('User not found', 404);
    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};
