import * as accountService from '../services/account.service.js';
import { sendSuccess } from '../utils/response.js';
import { getAuthUserId } from '../utils/auth.js';

export const getProfileController = async (req, res, next) => {
  try {
    const profile = await accountService.getProfile(getAuthUserId(req));
    return sendSuccess(res, 'Profile fetched successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const profile = await accountService.updateProfile(getAuthUserId(req), req.body);
    return sendSuccess(res, 'Profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const result = await accountService.changePassword(getAuthUserId(req), req.body);
    return sendSuccess(res, 'Password changed successfully', result);
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmailController = async (req, res, next) => {
  try {
    const result = await accountService.resendVerifyEmail(getAuthUserId(req));
    return sendSuccess(res, 'Verification email requested successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivitiesController = async (req, res, next) => {
  try {
    const activities = await accountService.getRecentActivities(getAuthUserId(req));
    return sendSuccess(res, 'Recent activities fetched successfully', activities);
  } catch (error) {
    next(error);
  }
};
