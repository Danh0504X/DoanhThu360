import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return sendError(res, 'Username must be at least 3 characters', 400);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }
    if (!password || password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    const result = await authService.registerUser({ username: username.trim(), email, password, name });
    return sendSuccess(res, 'Registration successful', result, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return sendError(res, 'Identifier (username or email) and password are required', 400);
    }

    const result = await authService.loginUser({ identifier, password });
    return sendSuccess(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return sendError(res, 'Google ID token is required', 400);
    }

    const result = await authService.loginWithGoogle(idToken);
    return sendSuccess(res, 'Google login successful', result);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return sendError(res, 'Refresh token is required', 400);
    }

    const result = await authService.refreshAccessToken(token);
    return sendSuccess(res, 'Token refreshed', result);
  } catch (err) {
    next(err);
  }
};
