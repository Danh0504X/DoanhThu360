import * as businessService from '../services/business.service.js';
import { getAuthUserId } from '../utils/auth.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const createBusinessController = async (req, res, next) => {
  try {
    const business = await businessService.createBusiness(getAuthUserId(req), req.body);
    return sendSuccess(res, 'Business created successfully', business, 201);
  } catch (error) {
    next(error);
  }
};

export const getBusinessesController = async (req, res, next) => {
  try {
    const businesses = await businessService.getBusinesses(getAuthUserId(req), req.query);
    return sendSuccess(res, 'Businesses fetched successfully', businesses);
  } catch (error) {
    next(error);
  }
};

export const getBusinessByIdController = async (req, res, next) => {
  try {
    const business = await businessService.getBusinessById(getAuthUserId(req), req.params.id);

    if (!business) return sendError(res, 'Business not found', 404);

    return sendSuccess(res, 'Business fetched successfully', business);
  } catch (error) {
    next(error);
  }
};

export const updateBusinessController = async (req, res, next) => {
  try {
    const business = await businessService.updateBusinessById(
      getAuthUserId(req),
      req.params.id,
      req.body,
    );

    if (!business) return sendError(res, 'Business not found', 404);

    return sendSuccess(res, 'Business updated successfully', business);
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessController = async (req, res, next) => {
  try {
    const business = await businessService.deleteBusinessById(getAuthUserId(req), req.params.id);

    if (!business) return sendError(res, 'Business not found', 404);

    return sendSuccess(res, 'Business deleted successfully', business);
  } catch (error) {
    next(error);
  }
};
