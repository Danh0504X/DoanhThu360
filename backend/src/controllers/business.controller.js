import * as businessService from '../services/business.service.js';
import { getAuthUserId } from '../utils/auth.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createBusinessController = asyncHandler(async (req, res) => {
  const business = await businessService.createBusiness(getAuthUserId(req), req.body);
  return sendSuccess(res, 'Business created successfully', business, 201);
});

export const getBusinessesController = asyncHandler(async (req, res) => {
  const businesses = await businessService.getBusinesses(getAuthUserId(req), req.query);
  return sendSuccess(res, 'Businesses fetched successfully', businesses);
});

export const getBusinessByIdController = asyncHandler(async (req, res) => {
  const business = await businessService.getBusinessById(getAuthUserId(req), req.params.id);

  if (!business) throw ApiError.notFound('Business not found');

  return sendSuccess(res, 'Business fetched successfully', business);
});

export const updateBusinessController = asyncHandler(async (req, res) => {
  const business = await businessService.updateBusinessById(
    getAuthUserId(req),
    req.params.id,
    req.body,
  );

  if (!business) throw ApiError.notFound('Business not found');

  return sendSuccess(res, 'Business updated successfully', business);
});

export const deleteBusinessController = asyncHandler(async (req, res) => {
  const business = await businessService.deleteBusinessById(getAuthUserId(req), req.params.id);

  if (!business) throw ApiError.notFound('Business not found');

  return sendSuccess(res, 'Business deleted successfully', business);
});

export const changeBusinessStatusController = asyncHandler(async (req, res) => {
  const business = await businessService.changeBusinessStatusById(
    getAuthUserId(req),
    req.params.id,
    req.body.status,
  );

  if (!business) throw ApiError.notFound('Business not found');

  return sendSuccess(res, 'Business status updated successfully', business);
});
