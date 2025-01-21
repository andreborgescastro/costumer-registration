import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { UserService } from "../services/userService";
import { User } from "../models/user";
import { successResponse, errorResponse } from "../utils/responseHelper";

const userService = new UserService();

export const createUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user: User = JSON.parse(event.body || "{}");
    const newUser = await userService.create(user);
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
    const id = event.pathParameters?.id || "";
    const user = await userService.getById(id);
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const updateUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id || "";
    const updates = JSON.parse(event.body || "{}");
    const updatedUser = await userService.update(id, updates);
    if (!updatedUser) return errorResponse("User not found", 404);
    return successResponse(updatedUser);
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};

export const deleteUser: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id || "";
    const deleted = await userService.delete(id);
    if (!deleted) return errorResponse("User not found", 404);
    return successResponse({ message: "User deleted successfully" });
  } catch (error) {
    return errorResponse((error as Error).message);
  }
};
