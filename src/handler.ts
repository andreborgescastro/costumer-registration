import * as dotenv from 'dotenv';

dotenv.config();

export { createUser, getAllUsers, getUserById, updateUser, deleteUser } from './controllers/userController';
