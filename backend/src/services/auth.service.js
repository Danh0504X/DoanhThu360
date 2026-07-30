import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import UserToken from '../models/UserToken.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  decodeToken,
} from '../utils/jwt.js';
import { hashToken } from '../utils/hash.js';
import { createError } from '../utils/errors.js';
import { generateOtpCode, sendPasswordResetCode } from './email.service.js';
import { getAppSettings } from './setting.service.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SALT_ROUNDS = 12;
const PASSWORD_RESET_EXPIRES_MINUTES = 10;

const buildTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
  username: user.username ?? null,
});

// Persist a hashed refresh token so it can be validated and revoked later.
const persistRefreshToken = async (userId, token, meta = {}) => {
  const decoded = decodeToken(token);
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });
};

// Build access + refresh tokens for a user and store the refresh token.
const issueTokens = async (user, meta = {}) => {
  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await persistRefreshToken(user._id, refreshToken, meta);

  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  emailVerified: Boolean(user.emailVerified),
  emailVerifiedAt: user.emailVerifiedAt,
  name: user.name,
  gender: user.gender,
  dob: user.dob,
  avatarId: user.avatarId,
  role: user.role,
  status: user.status,
  lastLogin: user.lastLogin,
  lastLoginMeta: user.lastLoginMeta,
  preferences: user.preferences,
  authProvider: user.authProvider,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─── Register ────────────────────────────────────────────────────────────────

export const getRegistrationStatus = async () => {
  const settings = await getAppSettings();
  return { registrationEnabled: settings.registrationEnabled };
};

export const registerUser = async ({ username, email, password, name }) => {
  const { registrationEnabled } = await getRegistrationStatus();
  if (!registrationEnabled) {
    throw createError('Đăng ký tài khoản mới hiện đang tạm khoá.', 403);
  }

  const orConditions = [];
  if (username) orConditions.push({ username: username.toLowerCase() });
  if (email) orConditions.push({ email: email.toLowerCase() });

  if (orConditions.length) {
    const existing = await User.findOne({ $or: orConditions });
    if (existing) {
      const conflict =
        existing.username === username?.toLowerCase() ? 'Username' : 'Email';
      throw createError(`${conflict} already taken`, 409);
    }
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    name,
    authProvider: 'local',
  });

  const tokens = await issueTokens(user);
  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = async ({ identifier, password }, meta = {}) => {
  const id = identifier.toLowerCase();

  const user = await User.findOne({
    $or: [{ username: id }, { email: id }],
    authProvider: 'local',
  }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError('Invalid credentials', 401);
  }

  if (user.status === 'banned') throw createError('Account is banned', 403);
  if (user.status === 'inactive') throw createError('Account is inactive', 403);

  user.lastLogin = new Date();
  user.lastLoginMeta = {
    userAgent: meta.userAgent || null,
    platform: meta.platform || null,
    browser: meta.browser || null,
    ipAddress: meta.ipAddress || null,
  };
  await user.save();

  const tokens = await issueTokens(user, meta);
  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export const loginWithGoogle = async (idToken, meta = {}) => {
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch {
    throw createError('Invalid Google token', 401);
  }

  const { sub: googleId, email, name, picture } = ticket.getPayload();

  // Find by googleId first, then fall back to matching email
  let user = await User.findOne({ googleId });

  if (!user && email) {
    user = await User.findOne({ email });
  }

  if (user) {
    if (user.status === 'banned') throw createError('Account is banned', 403);
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
    }
    user.emailVerified = Boolean(email);
    if (email && !user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = await User.create({
      googleId,
      email,
      name,
      avatarId: picture,
      authProvider: 'google',
      emailVerified: Boolean(email),
      emailVerifiedAt: email ? new Date() : undefined,
    });
  }

  const tokens = await issueTokens(user, meta);
  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshAccessToken = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw createError('Invalid or expired refresh token', 401);
  }

  // The token must still exist in our store and not have been revoked (logout).
  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(token),
    userId: decoded.sub,
  });
  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw createError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.sub);
  if (!user) throw createError('User not found', 404);
  if (user.status === 'banned') throw createError('Account is banned', 403);
  if (user.status === 'inactive') throw createError('Account is inactive. Please contact support.', 403);

  const payload = buildTokenPayload(user);
  return { accessToken: generateAccessToken(payload) };
};

// ─── Logout ────────────────────────────────────────────────────────────────────

// Revoke the given refresh token so it can no longer be used to refresh.
export const logoutUser = async (userId, token) => {
  if (!token) return;

  await RefreshToken.updateOne(
    { tokenHash: hashToken(token), userId },
    { $set: { isRevoked: true, revokedAt: new Date() } },
  );
};

// ─── Forgot Password ────────────────────────────────────────────────────────

// Step 1: user requests a reset. We email a 6-digit code and store its hash.
// Always returns the same generic message so the endpoint can't be used to probe
// which emails have accounts.
export const requestPasswordReset = async ({ email }) => {
  const genericResponse = {
    message: 'If an account exists for this email, a reset code has been sent.',
  };

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({
    email: normalizedEmail,
    authProvider: 'local',
  });

  // No local account (missing, or signs in with Google) -> stay generic.
  if (!user) return genericResponse;

  // Invalidate any earlier, still-pending reset codes for this user.
  await UserToken.updateMany(
    { userId: user._id, type: 'password_reset', usedAt: null, isRevoked: false },
    { $set: { isRevoked: true, revokedAt: new Date() } },
  );

  const code = generateOtpCode();
  await UserToken.create({
    userId: user._id,
    type: 'password_reset',
    tokenHash: hashToken(code),
    email: normalizedEmail,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000),
  });

  await sendPasswordResetCode({
    to: normalizedEmail,
    code,
    expiresInMinutes: PASSWORD_RESET_EXPIRES_MINUTES,
  });

  return genericResponse;
};

// Step 2: user submits the emailed code + a new password.
export const resetPassword = async ({ email, code, newPassword }) => {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({
    email: normalizedEmail,
    authProvider: 'local',
  });
  if (!user) throw createError('Invalid or expired reset code', 400);

  // The code must hash to a stored token that is unused, not revoked, not expired.
  const tokenDoc = await UserToken.findOne({
    userId: user._id,
    type: 'password_reset',
    tokenHash: hashToken(code),
    usedAt: null,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
  if (!tokenDoc) throw createError('Invalid or expired reset code', 400);

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  // Single-use: burn the code so it can't be replayed.
  tokenDoc.usedAt = new Date();
  await tokenDoc.save();

  // Force every existing session to re-authenticate after a password reset.
  await RefreshToken.updateMany(
    { userId: user._id, isRevoked: false },
    { $set: { isRevoked: true, revokedAt: new Date() } },
  );

  return { message: 'Password has been reset successfully' };
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);
  return { user: sanitizeUser(user) };
};
