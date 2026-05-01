import * as revenueEntryService from '../services/revenueEntry.service.js';
import { getAuthUserId } from '../utils/auth.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const createRevenueEntryController = async (req, res, next) => {
  try {
    const revenueEntry = await revenueEntryService.createRevenueEntry(getAuthUserId(req), req.body);
    return sendSuccess(res, 'Revenue entry created successfully', revenueEntry, 201);
  } catch (error) {
    next(error);
  }
};

export const getRevenueEntriesController = async (req, res, next) => {
  try {
    const result = await revenueEntryService.getRevenueEntries(getAuthUserId(req), req.query);

    return res.status(200).json({
      success: true,
      message: 'Revenue entries fetched successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueEntryByIdController = async (req, res, next) => {
  try {
    const revenueEntry = await revenueEntryService.getRevenueEntryById(
      getAuthUserId(req),
      req.params.id,
    );

    if (!revenueEntry) return sendError(res, 'Revenue entry not found', 404);

    return sendSuccess(res, 'Revenue entry fetched successfully', revenueEntry);
  } catch (error) {
    next(error);
  }
};

export const updateRevenueEntryController = async (req, res, next) => {
  try {
    const revenueEntry = await revenueEntryService.updateRevenueEntryById(
      getAuthUserId(req),
      req.params.id,
      req.body,
    );

    if (!revenueEntry) return sendError(res, 'Revenue entry not found', 404);

    return sendSuccess(res, 'Revenue entry updated successfully', revenueEntry);
  } catch (error) {
    next(error);
  }
};

export const deleteRevenueEntryController = async (req, res, next) => {
  try {
    const revenueEntry = await revenueEntryService.deleteRevenueEntryById(
      getAuthUserId(req),
      req.params.id,
    );

    if (!revenueEntry) return sendError(res, 'Revenue entry not found', 404);

    return sendSuccess(res, 'Revenue entry deleted successfully', revenueEntry);
  } catch (error) {
    next(error);
  }
};

export const getRevenueSummaryController = async (req, res, next) => {
  try {
    const summary = await revenueEntryService.getRevenueSummary(getAuthUserId(req), req.query);
    return sendSuccess(res, 'Revenue summary fetched successfully', summary);
  } catch (error) {
    next(error);
  }
};

export const getRevenueDailyChartController = async (req, res, next) => {
  try {
    const chart = await revenueEntryService.getRevenueDailyChart(getAuthUserId(req), req.query);
    return sendSuccess(res, 'Revenue daily chart fetched successfully', chart);
  } catch (error) {
    next(error);
  }
};
