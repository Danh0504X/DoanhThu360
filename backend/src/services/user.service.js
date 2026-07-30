import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createError } from '../utils/errors.js';

const SALT_ROUNDS = 12;

const selectUserFields = '-password -googleId';

// Fields a regular user can update on their own profile
const USER_UPDATE_FIELDS = ['name', 'gender', 'dob', 'avatarId', 'preferences'];

// Additional fields only an admin can update
const ADMIN_ONLY_FIELDS = ['role', 'status'];

// Fields accepted when an admin creates a user (never trust the raw payload).
const USER_CREATE_FIELDS = [
  'username',
  'email',
  'name',
  'phone',
  'gender',
  'dob',
  'avatarId',
  'role',
  'status',
];

export const createUser = async (payload = {}) => {
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => USER_CREATE_FIELDS.includes(key)),
  );

  if (!payload.password) {
    throw createError('Password is required', 400);
  }

  safePayload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  safePayload.authProvider = 'local';

  const user = await User.create(safePayload);

  return User.findById(user._id).select(selectUserFields);
};

export const getUsers = async (filter = {}) => {
  const query = {};
  const page = Number(filter.page) > 0 ? Number(filter.page) : 1;
  const limit = Number(filter.limit) > 0 ? Number(filter.limit) : 10;

  if (filter.role && filter.role !== 'all') {
    query.role = filter.role;
  }

  if (filter.status && filter.status !== 'all') {
    query.status = filter.status;
  }

  if (filter.keyword) {
    const keywordRegex = new RegExp(filter.keyword.trim(), 'i');
    query.$or = [
      { username: keywordRegex },
      { email: keywordRegex },
      { name: keywordRegex },
    ];
  }

  const [rows, total] = await Promise.all([
    User.find(query)
      .select(selectUserFields)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
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
