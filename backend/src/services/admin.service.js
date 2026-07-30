import User from '../models/User.js';
import Business from '../models/Business.js';
import RevenueEntry from '../models/RevenueEntry.js';

const selectUserFields = '-password -googleId';
const RECENT_LIST_LIMIT = 8;
const SIGNUP_TREND_DAYS = 30;

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// Daily new-signup counts for the last N days, oldest first — feeds the
// small trend chart on the admin overview page. Days with zero signups are
// filled in explicitly since $group only returns days that actually occurred.
const getSignupTrend = async (days) => {
  const since = daysAgo(days);

  const grouped = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const countByDay = new Map(grouped.map((entry) => [entry._id, entry.count]));
  const trend = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = daysAgo(offset);
    const key = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD
    trend.push({ date: key, count: countByDay.get(key) || 0 });
  }

  return trend;
};

export const getDashboardStats = async () => {
  const thirtyDaysAgo = daysAgo(30);

  const [
    totalUsers,
    activeUsers,
    bannedUsers,
    newRegistrations30d,
    recentSignups,
    recentLogins,
    signupTrend,
    totalBusinesses,
    totalRevenueEntries,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'banned' }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.find().select(selectUserFields).sort({ createdAt: -1 }).limit(RECENT_LIST_LIMIT),
    User.find({ lastLogin: { $ne: null } }).select(selectUserFields).sort({ lastLogin: -1 }).limit(RECENT_LIST_LIMIT),
    getSignupTrend(SIGNUP_TREND_DAYS),
    Business.countDocuments(),
    RevenueEntry.countDocuments({ isDeleted: { $ne: true } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    bannedUsers,
    newRegistrations30d,
    recentSignups,
    recentLogins,
    signupTrend,
    system: {
      totalBusinesses,
      totalRevenueEntries,
    },
  };
};
