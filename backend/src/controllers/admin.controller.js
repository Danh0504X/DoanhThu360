import { getDashboardStats } from '../services/admin.service.js';
import { getAppSettings, updateAppSettings } from '../services/setting.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  return sendSuccess(res, 'Admin dashboard stats', stats);
});

export const getSettingsController = asyncHandler(async (req, res) => {
  const settings = await getAppSettings();
  return sendSuccess(res, 'App settings', settings);
});

export const updateSettingsController = asyncHandler(async (req, res) => {
  const settings = await updateAppSettings(req.body);
  return sendSuccess(res, 'App settings updated', settings);
});
