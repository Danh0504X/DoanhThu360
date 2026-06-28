import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// Extract request metadata (used for login history / refresh-token records).
const getRequestMeta = (req) => ({
  userAgent: req.headers['user-agent'] || null,
  ipAddress: req.ip || req.socket?.remoteAddress || null,
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw ApiError.badRequest('Username must be at least 3 characters');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('Invalid email format');
  }
  if (!password || password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  const result = await authService.registerUser({ username: username.trim(), email, password, name });
  return sendSuccess(res, 'Registration successful', result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw ApiError.badRequest('Identifier (username or email) and password are required');
  }

  const result = await authService.loginUser({ identifier, password }, getRequestMeta(req));
  return sendSuccess(res, 'Login successful', result);
});

export const loginWithGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw ApiError.badRequest('Google ID token is required');
  }

  const result = await authService.loginWithGoogle(idToken, getRequestMeta(req));
  return sendSuccess(res, 'Google login successful', result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('A valid email is required');
  }

  const result = await authService.requestPasswordReset({ email });
  return sendSuccess(res, result.message, null);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('A valid email is required');
  }
  if (!code || !/^\d{6}$/.test(String(code))) {
    throw ApiError.badRequest('A valid 6-digit code is required');
  }
  if (!newPassword || newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters');
  }

  const result = await authService.resetPassword({ email, code, newPassword });
  return sendSuccess(res, result.message, null);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw ApiError.badRequest('Refresh token is required');
  }

  const result = await authService.refreshAccessToken(token);
  return sendSuccess(res, 'Token refreshed', result);
});

export const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user.sub);
  return sendSuccess(res, 'Current user', result);
});

export const logout = asyncHandler(async (req, res) => {
  // Revoke the presented refresh token so it can no longer be used.
  const { refreshToken: token } = req.body || {};
  await authService.logoutUser(req.user.sub, token);
  return sendSuccess(res, 'Logged out successfully', null);
});
