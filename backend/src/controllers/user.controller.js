import {
  adminUpdateUserById,
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  return sendSuccess(res, 'User created successfully', user, 201);
});

export const getUsersController = asyncHandler(async (req, res) => {
  const users = await getUsers(req.query);
  return sendSuccess(res, 'Users retrieved successfully', users);
});

export const getUserByIdController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) throw ApiError.notFound('User not found');

  return sendSuccess(res, 'User retrieved successfully', user);
});

/**
 * PATCH /users/:id
 * Authenticated user updates their own profile (name, gender, dob, avatarId, preferences).
 * role and status are silently ignored.
 */
export const updateUserController = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.params.id, req.body);

  if (!user) throw ApiError.notFound('User not found');

  return sendSuccess(res, 'User updated successfully', user);
});

/**
 * PATCH /users/:id/admin
 * Admin updates role and/or status (plus any profile field).
 * Protected by authorize('admin') middleware in routes.
 */
export const adminUpdateUserController = asyncHandler(async (req, res) => {
  const user = await adminUpdateUserById(req.params.id, req.body);

  if (!user) throw ApiError.notFound('User not found');

  return sendSuccess(res, 'User updated by admin successfully', user);
});

export const deleteUserController = asyncHandler(async (req, res) => {
  const user = await deleteUserById(req.params.id);

  if (!user) throw ApiError.notFound('User not found');

  return sendSuccess(res, 'User deleted successfully');
});
