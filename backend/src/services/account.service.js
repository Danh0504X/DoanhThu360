import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import UserToken from '../models/UserToken.js';
import { createError } from '../utils/errors.js';
import { hashToken } from '../utils/hash.js';
import { generateOtpCode, sendVerificationCode } from './email.service.js';

const selectAccountFields =
  'username email emailVerified emailVerifiedAt name phone dob role status avatarId authProvider lastLogin lastLoginMeta createdAt updatedAt';

const PHONE_REGEX = /^(?:\+84|84|0)(?:\d){8,10}$/;
const EMAIL_VERIFICATION_EXPIRES_MINUTES = 10;

const sanitizeProfile = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.name || '',
  phone: user.phone || '',
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

  if (payload.phone !== undefined) {
    const phone = String(payload.phone || '').trim();
    if (phone && !PHONE_REGEX.test(phone.replace(/\s+/g, ''))) {
      throw createError('Phone number is invalid', 400);
    }
    updates.phone = phone;
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

// Generate a 6-digit code, store its hash, and email it to the user (TaskFlow-style
// OTP flow, reusing the UserToken model with type 'email_verification').
export const sendEmailVerificationCode = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  if (!user.email) {
    throw createError('Tài khoản chưa có email để xác minh', 400);
  }

  if (user.emailVerified) {
    return { email: user.email, emailVerified: true, alreadyVerified: true };
  }

  // Invalidate any previous pending verification codes for this user.
  await UserToken.updateMany(
    { userId: user._id, type: 'email_verification', usedAt: null, isRevoked: false },
    { $set: { isRevoked: true, revokedAt: new Date() } },
  );

  const code = generateOtpCode();
  await UserToken.create({
    userId: user._id,
    type: 'email_verification',
    tokenHash: hashToken(code),
    email: user.email,
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000),
  });

  await sendVerificationCode({
    to: user.email,
    code,
    expiresInMinutes: EMAIL_VERIFICATION_EXPIRES_MINUTES,
  });

  return {
    email: user.email,
    emailVerified: false,
    sentAt: new Date(),
    expiresInMinutes: EMAIL_VERIFICATION_EXPIRES_MINUTES,
  };
};

// Verify the emailed code and mark the user's email as verified (single-use code).
export const verifyEmailCode = async (userId, { code } = {}) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  if (user.emailVerified) {
    return { email: user.email, emailVerified: true, alreadyVerified: true };
  }

  if (!code || !/^\d{6}$/.test(String(code))) {
    throw createError('Vui lòng nhập mã gồm 6 chữ số', 400);
  }

  const tokenDoc = await UserToken.findOne({
    userId: user._id,
    type: 'email_verification',
    tokenHash: hashToken(code),
    usedAt: null,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    throw createError('Mã xác minh không hợp lệ hoặc đã hết hạn', 400);
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  await user.save();

  tokenDoc.usedAt = new Date();
  await tokenDoc.save();

  return {
    email: user.email,
    emailVerified: true,
    emailVerifiedAt: user.emailVerifiedAt,
  };
};

export const getRecentActivities = async (userId) => {
  const user = await User.findById(userId).select(selectAccountFields);

  if (!user) {
    throw createError('User not found', 404);
  }

  return buildRecentActivities(user);
};
