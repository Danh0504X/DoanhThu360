import * as revenueEntryService from '../services/revenueEntry.service.js';
import { getAuthUserId } from '../utils/auth.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createRevenueEntryController = asyncHandler(async (req, res) => {
  const revenueEntry = await revenueEntryService.createRevenueEntry(getAuthUserId(req), req.body);
  return sendSuccess(res, 'Revenue entry created successfully', revenueEntry, 201);
});

export const getRevenueEntriesController = asyncHandler(async (req, res) => {
  const result = await revenueEntryService.getRevenueEntries(getAuthUserId(req), req.query);

  return res.status(200).json({
    success: true,
    message: 'Revenue entries fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const getRevenueEntryByIdController = asyncHandler(async (req, res) => {
  const revenueEntry = await revenueEntryService.getRevenueEntryById(
    getAuthUserId(req),
    req.params.id,
  );

  if (!revenueEntry) throw ApiError.notFound('Revenue entry not found');

  return sendSuccess(res, 'Revenue entry fetched successfully', revenueEntry);
});

export const updateRevenueEntryController = asyncHandler(async (req, res) => {
  const revenueEntry = await revenueEntryService.updateRevenueEntryById(
    getAuthUserId(req),
    req.params.id,
    req.body,
  );

  if (!revenueEntry) throw ApiError.notFound('Revenue entry not found');

  return sendSuccess(res, 'Revenue entry updated successfully', revenueEntry);
});

export const deleteRevenueEntryController = asyncHandler(async (req, res) => {
  const revenueEntry = await revenueEntryService.deleteRevenueEntryById(
    getAuthUserId(req),
    req.params.id,
  );

  if (!revenueEntry) throw ApiError.notFound('Revenue entry not found');

  return sendSuccess(res, 'Revenue entry deleted successfully', revenueEntry);
});

export const getRevenueSummaryController = asyncHandler(async (req, res) => {
  const summary = await revenueEntryService.getRevenueSummary(getAuthUserId(req), req.query);
  return sendSuccess(res, 'Revenue summary fetched successfully', summary);
});

export const getRevenueDailyChartController = asyncHandler(async (req, res) => {
  const chart = await revenueEntryService.getRevenueDailyChart(getAuthUserId(req), req.query);
  return sendSuccess(res, 'Revenue daily chart fetched successfully', chart);
});
