import * as accountService from '../services/account.service.js';
import { sendSuccess } from '../utils/response.js';
import { getAuthUserId } from '../utils/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getProfileController = asyncHandler(async (req, res) => {
  const profile = await accountService.getProfile(getAuthUserId(req));
  return sendSuccess(res, 'Profile fetched successfully', profile);
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const profile = await accountService.updateProfile(getAuthUserId(req), req.body);
  return sendSuccess(res, 'Profile updated successfully', profile);
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const result = await accountService.changePassword(getAuthUserId(req), req.body);
  return sendSuccess(res, 'Password changed successfully', result);
});

export const sendVerificationCodeController = asyncHandler(async (req, res) => {
  const result = await accountService.sendEmailVerificationCode(getAuthUserId(req));
  return sendSuccess(res, 'Verification code sent successfully', result);
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const result = await accountService.verifyEmailCode(getAuthUserId(req), req.body);
  return sendSuccess(res, 'Email verified successfully', result);
});

export const getRecentActivitiesController = asyncHandler(async (req, res) => {
  const activities = await accountService.getRecentActivities(getAuthUserId(req));
  return sendSuccess(res, 'Recent activities fetched successfully', activities);
});
