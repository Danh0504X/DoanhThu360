import Business from '../models/Business.js';
import RevenueEntry from '../models/RevenueEntry.js';
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

  if (filter.status) {
    query.status = filter.status;
  }

  return Business.find(query).sort({ createdAt: -1 });
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

  const hasRevenueEntries = await RevenueEntry.exists({
    businessId,
    userId: ownerId,
    isDeleted: false,
  });

  if (hasRevenueEntries) {
    business.status = 'inactive';
    await business.save();
    return business;
  }

  business.status = 'inactive';
  await business.save();
  return business;
};

export const ensureBusinessOwnership = async (ownerId, businessId) => {
  const business = await Business.findOne({ _id: businessId, ownerId });

  if (!business) {
    throw createError('Business not found', 404);
  }

  return business;
};
