import {
  adminUpdateUserById,
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '../services/user.service.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return sendSuccess(res, 'User created successfully', user, 201);
  } catch (error) {
    next(error);
  }
};

export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    return sendSuccess(res, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/:id
 * Authenticated user updates their own profile (name, gender, dob, avatarId, preferences).
 * role and status are silently ignored.
 */
export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateUserById(req.params.id, req.body);

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/:id/admin
 * Admin updates role and/or status (plus any profile field).
 * Protected by authorize('admin') middleware in routes.
 */
export const adminUpdateUserController = async (req, res, next) => {
  try {
    const user = await adminUpdateUserById(req.params.id, req.body);

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User updated by admin successfully', user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUserById(req.params.id);

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
