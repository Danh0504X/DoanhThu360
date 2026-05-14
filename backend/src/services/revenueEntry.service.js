import mongoose from 'mongoose';
import Business from '../models/Business.js';
import RevenueEntry from '../models/RevenueEntry.js';
import { createError } from '../utils/errors.js';
import { toVietnamDateBoundary, VIETNAM_TIMEZONE } from '../utils/timezone.js';

const buildRevenueTotal = (cashAmount = 0, bankAmount = 0) =>
  Number(cashAmount || 0) + Number(bankAmount || 0);

const buildRevenueMatch = (userId, filters = {}) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  };

  if (filters.businessId) {
    match.businessId = new mongoose.Types.ObjectId(filters.businessId);
  }

  if (filters.status) {
    match.status = filters.status;
  }

  if (filters.from || filters.to) {
    match.revenueDate = {};
    if (filters.from) match.revenueDate.$gte = toVietnamDateBoundary(filters.from, 'start');
    if (filters.to) match.revenueDate.$lte = toVietnamDateBoundary(filters.to, 'end');
  }

  return match;
};

const sanitizeRevenuePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

const ensureBusinessAccessible = async (userId, businessId) => {
  const business = await Business.findOne({ _id: businessId, ownerId: userId });

  if (!business) {
    throw createError('Business not found', 404);
  }

  return business;
};

export const createRevenueEntry = async (userId, payload) => {
  await ensureBusinessAccessible(userId, payload.businessId);

  const data = sanitizeRevenuePayload(payload);
  data.userId = userId;
  data.createdBy = userId;
  data.totalAmount = buildRevenueTotal(data.cashAmount, data.bankAmount);

  return RevenueEntry.create(data);
};

export const getRevenueEntries = async (userId, filters) => {
  if (filters.businessId) {
    await ensureBusinessAccessible(userId, filters.businessId);
  }

  const match = buildRevenueMatch(userId, filters);
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    RevenueEntry.find(match)
      .sort({ revenueDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    RevenueEntry.countDocuments(match),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getRevenueEntryById = async (userId, revenueEntryId) =>
  RevenueEntry.findOne({
    _id: revenueEntryId,
    userId,
    isDeleted: false,
  });

export const updateRevenueEntryById = async (userId, revenueEntryId, payload) => {
  const revenueEntry = await RevenueEntry.findOne({
    _id: revenueEntryId,
    userId,
    isDeleted: false,
  });

  if (!revenueEntry) return null;

  const data = sanitizeRevenuePayload(payload);

  if (data.businessId) {
    await ensureBusinessAccessible(userId, data.businessId);
  }

  const nextCashAmount = data.cashAmount ?? revenueEntry.cashAmount;
  const nextBankAmount = data.bankAmount ?? revenueEntry.bankAmount;

  Object.assign(revenueEntry, data, {
    totalAmount: buildRevenueTotal(nextCashAmount, nextBankAmount),
    updatedBy: userId,
  });

  await revenueEntry.save();
  return revenueEntry;
};

export const deleteRevenueEntryById = async (userId, revenueEntryId) => {
  const revenueEntry = await RevenueEntry.findOne({
    _id: revenueEntryId,
    userId,
    isDeleted: false,
  });

  if (!revenueEntry) return null;

  revenueEntry.isDeleted = true;
  revenueEntry.deletedAt = new Date();
  revenueEntry.deletedBy = userId;
  revenueEntry.updatedBy = userId;

  await revenueEntry.save();
  return revenueEntry;
};

export const getRevenueSummary = async (userId, filters) => {
  if (filters.businessId) {
    await ensureBusinessAccessible(userId, filters.businessId);
  }

  const match = buildRevenueMatch(userId, filters);
  const [summary] = await RevenueEntry.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCash: { $sum: '$cashAmount' },
        totalBank: { $sum: '$bankAmount' },
        totalRevenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalCash: summary?.totalCash || 0,
    totalBank: summary?.totalBank || 0,
    totalRevenue: summary?.totalRevenue || 0,
    count: summary?.count || 0,
  };
};

export const getRevenueDailyChart = async (userId, filters) => {
  if (filters.businessId) {
    await ensureBusinessAccessible(userId, filters.businessId);
  }

  const match = buildRevenueMatch(userId, filters);

  return RevenueEntry.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$revenueDate',
            timezone: VIETNAM_TIMEZONE,
          },
        },
        totalCash: { $sum: '$cashAmount' },
        totalBank: { $sum: '$bankAmount' },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        totalCash: 1,
        totalBank: 1,
        totalRevenue: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);
};
