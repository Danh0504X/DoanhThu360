import mongoose from 'mongoose';
import RevenueEntry from '../models/RevenueEntry.js';
import { VIETNAM_TIMEZONE } from '../utils/timezone.js';

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const buildMatch = ({ userId, businessId, from, to }) => ({
  userId: toObjectId(userId),
  businessId: toObjectId(businessId),
  isDeleted: false,
  revenueDate: {
    $gte: from,
    $lte: to,
  },
});

export const getRevenueWordRows = async ({ userId, businessId, from, to }) =>
  RevenueEntry.aggregate([
    {
      $match: buildMatch({ userId, businessId, from, to }),
    },
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
        notes: { $addToSet: '$note' },
        entryCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        totalCash: 1,
        totalBank: 1,
        totalRevenue: 1,
        entryCount: 1,
        notes: {
          $filter: {
            input: '$notes',
            as: 'note',
            cond: {
              $and: [
                { $ne: ['$$note', null] },
                { $ne: ['$$note', ''] },
              ],
            },
          },
        },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);
