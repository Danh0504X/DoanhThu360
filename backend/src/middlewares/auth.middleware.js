import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token required', data: null });
  }

  try {
    req.user = verifyAccessToken(authHeader.split(' ')[1]);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ success: false, message, data: null });
  }
};

// Usage: router.get('/admin', authenticate, authorize('admin'), handler)
export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions', data: null });
    }
    next();
  };

// Allow access only to the resource owner (matching :param) or an admin.
// Usage: router.get('/:id', authenticate, authorizeSelfOrAdmin('id'), handler)
export const authorizeSelfOrAdmin = (idParam = 'id') =>
  (req, res, next) => {
    const requesterId = req.user?.sub;
    const isSelf = requesterId && String(requesterId) === String(req.params[idParam]);
    const isAdmin = req.user?.role === 'admin';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions', data: null });
    }
    next();
  };
