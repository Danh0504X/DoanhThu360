import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SALT_ROUNDS = 12;

const createError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

const buildTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
  username: user.username ?? null,
});

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  gender: user.gender,
  dob: user.dob,
  avatarId: user.avatarId,
  role: user.role,
  status: user.status,
  preferences: user.preferences,
  authProvider: user.authProvider,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─── Register ────────────────────────────────────────────────────────────────

export const registerUser = async ({ username, email, password, name }) => {
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

  const payload = buildTokenPayload(user);
  return {
    user: sanitizeUser(user),
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = async ({ identifier, password }) => {
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
  await user.save();

  const payload = buildTokenPayload(user);
  return {
    user: sanitizeUser(user),
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export const loginWithGoogle = async (idToken) => {
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
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = await User.create({
      googleId,
      email,
      name,
      avatarId: picture,
      authProvider: 'google',
    });
  }

  const payload = buildTokenPayload(user);
  return {
    user: sanitizeUser(user),
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
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

  const user = await User.findById(decoded.sub);
  if (!user) throw createError('User not found', 404);
  if (user.status === 'banned') throw createError('Account is banned', 403);
  if (user.status === 'inactive') throw createError('Account is inactive. Please contact support.', 403);

  const payload = buildTokenPayload(user);
  return { accessToken: generateAccessToken(payload) };
};
