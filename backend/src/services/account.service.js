import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createError } from '../utils/errors.js';

const selectAccountFields =
  'username email emailVerified emailVerifiedAt name dob role status avatarId authProvider lastLogin lastLoginMeta createdAt updatedAt';

const PHONE_REGEX = /^(?:\+84|84|0)(?:\d){8,10}$/;

const sanitizeProfile = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.name || '',
  phone: user.preferences?.phone || '',
  email: user.email || '',
  birthDate: user.dob || null,
  role: user.role,
  status: user.status,
  avatarId: user.avatarId || '',
  emailVerified: Boolean(user.emailVerified),
  emailVerifiedAt: user.emailVerifiedAt || null,
  authProvider: user.authProvider,
});

const buildRecentActivities = (user) => {
  if (!user?.lastLogin) {
    return [];
  }

  return [
    {
      id: `last-login-${user._id}`,
      type: 'login',
      title: `Đăng nhập từ ${user.lastLoginMeta?.browser || 'trình duyệt'}, ${user.lastLoginMeta?.platform || 'thiết bị'}`,
      description: user.lastLoginMeta?.ipAddress
        ? `IP: ${user.lastLoginMeta.ipAddress}`
        : 'Hoạt động đăng nhập gần nhất của tài khoản',
      createdAt: user.lastLogin,
    },
  ];
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select(selectAccountFields);

  if (!user) {
    throw createError('User not found', 404);
  }

  return sanitizeProfile(user);
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw createError('User not found', 404);
  }

  const updates = {};

  if (typeof payload.fullName === 'string') {
    const fullName = payload.fullName.trim();
    if (!fullName) {
      throw createError('Full name is required', 400);
    }
    updates.name = fullName;
  }

  if (payload.birthDate !== undefined) {
    updates.dob = payload.birthDate ? new Date(payload.birthDate) : null;
  }

  const nextPreferences = { ...(user.preferences || {}) };

  if (payload.phone !== undefined) {
    const phone = String(payload.phone || '').trim();
    if (phone && !PHONE_REGEX.test(phone.replace(/\s+/g, ''))) {
      throw createError('Phone number is invalid', 400);
    }
    nextPreferences.phone = phone;
  }

  if (payload.email !== undefined) {
    const email = String(payload.email || '').trim().toLowerCase();
    if (!email) {
      throw createError('Email is required', 400);
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw createError('Email already taken', 409);
      }

      updates.email = email;
      updates.emailVerified = false;
      updates.emailVerifiedAt = null;
    }
  }

  updates.preferences = nextPreferences;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select(selectAccountFields);

  return sanitizeProfile(updatedUser);
};

export const changePassword = async (userId, payload) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw createError('User not found', 404);
  }

  if (user.authProvider !== 'local') {
    throw createError('This account signs in with a third-party provider', 400);
  }

  const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.password || '');
  if (!isCurrentPasswordValid) {
    throw createError('Current password is incorrect', 400);
  }

  if (payload.currentPassword === payload.newPassword) {
    throw createError('New password must be different from current password', 400);
  }

  user.password = await bcrypt.hash(payload.newPassword, 12);
  await user.save();

  return { success: true };
};

export const resendVerifyEmail = async (userId) => {
  const user = await User.findById(userId).select(selectAccountFields);

  if (!user) {
    throw createError('User not found', 404);
  }

  return {
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    sentAt: new Date(),
  };
};

export const getRecentActivities = async (userId) => {
  const user = await User.findById(userId).select(selectAccountFields);

  if (!user) {
    throw createError('User not found', 404);
  }

  return buildRecentActivities(user);
};
