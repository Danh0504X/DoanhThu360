export const getAuthUserId = (req) => req.user?._id || req.user?.sub || req.user?.id || null;
