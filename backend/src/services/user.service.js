import User from '../models/User.js';

const selectUserFields = '-password -googleId';

// Fields a regular user can update on their own profile
const USER_UPDATE_FIELDS = ['name', 'gender', 'dob', 'avatarId', 'preferences'];

// Additional fields only an admin can update
const ADMIN_ONLY_FIELDS = ['role', 'status'];

export const createUser = async (payload) => {
  const user = await User.create(payload);

  return User.findById(user._id).select(selectUserFields);
};

export const getUsers = async (filter = {}) => {
  return User.find(filter).select(selectUserFields).sort({ createdAt: -1 });
};

export const getUserById = async (userId) => {
  return User.findById(userId).select(selectUserFields);
};

/**
 * Update a user's own profile fields (non-sensitive).
 */
export const updateUserById = async (userId, payload) => {
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => USER_UPDATE_FIELDS.includes(key)),
  );

  return User.findByIdAndUpdate(userId, safePayload, {
    new: true,
    runValidators: true,
  }).select(selectUserFields);
};

/**
 * Admin-only: update role and/or status (plus any profile field).
 */
export const adminUpdateUserById = async (userId, payload) => {
  const allowedFields = [...USER_UPDATE_FIELDS, ...ADMIN_ONLY_FIELDS];
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.includes(key)),
  );

  return User.findByIdAndUpdate(userId, safePayload, {
    new: true,
    runValidators: true,
  }).select(selectUserFields);
};

export const deleteUserById = async (userId) => {
  return User.findByIdAndDelete(userId);
};
