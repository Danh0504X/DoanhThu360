import mongoose from 'mongoose';
import Business from '../models/Business.js';
import { createError } from '../utils/errors.js';

const sanitizeBusinessPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

export const createBusiness = async (ownerId, payload) => {
  const business = await Business.create({
    ...sanitizeBusinessPayload(payload),
    ownerId,
  });

  return business;
};

export const getBusinesses = async (ownerId, filter = {}) => {
  const query = { ownerId };
  const page = Number(filter.page) > 0 ? Number(filter.page) : 1;
  const limit = Number(filter.limit) > 0 ? Number(filter.limit) : 10;

  if (filter.status && filter.status !== 'all') {
    query.status = filter.status;
  }

  if (filter.keyword) {
    const keywordRegex = new RegExp(filter.keyword.trim(), 'i');
    query.$or = [
      { businessName: keywordRegex },
      { taxCode: keywordRegex },
      { address: keywordRegex },
    ];
  }

  // Aggregate so each business carries its (non-deleted) revenue-entry count,
  // letting the UI pick a sensible default (e.g. the busiest business).
  const matchStage = { ...query, ownerId: new mongoose.Types.ObjectId(ownerId) };

  const [rows, total] = await Promise.all([
    Business.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'revenueentries',
          let: { businessId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$businessId', '$$businessId'] },
                isDeleted: { $ne: true },
              },
            },
            { $count: 'count' },
          ],
          as: '_revenueCount',
        },
      },
      {
        $addFields: {
          revenueCount: { $ifNull: [{ $arrayElemAt: ['$_revenueCount.count', 0] }, 0] },
        },
      },
      { $project: { _revenueCount: 0 } },
    ]),
    Business.countDocuments(query),
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getBusinessById = async (ownerId, businessId) =>
  Business.findOne({ _id: businessId, ownerId });

export const updateBusinessById = async (ownerId, businessId, payload) =>
  Business.findOneAndUpdate(
    { _id: businessId, ownerId },
    sanitizeBusinessPayload(payload),
    {
      new: true,
      runValidators: true,
    },
  );

export const deleteBusinessById = async (ownerId, businessId) => {
  const business = await Business.findOne({ _id: businessId, ownerId });

  if (!business) return null;

  // Soft-delete: keep the record (and any linked revenue history) but mark inactive.
  business.status = 'inactive';
  await business.save();
  return business;
};

export const changeBusinessStatusById = async (ownerId, businessId, status) =>
  Business.findOneAndUpdate(
    { _id: businessId, ownerId },
    { status },
    {
      new: true,
      runValidators: true,
    },
  );

export const ensureBusinessOwnership = async (ownerId, businessId) => {
  const business = await Business.findOne({ _id: businessId, ownerId });

  if (!business) {
    throw createError('Business not found', 404);
  }

  return business;
};
