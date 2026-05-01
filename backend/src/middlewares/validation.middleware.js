import { sendError } from '../utils/response.js';

export const validate = ({ body, query, params } = {}) =>
  (req, res, next) => {
    if (body) {
      const result = body(req.body);
      if (!result.success) return sendError(res, result.message, 400);
      req.body = result.data;
    }

    if (query) {
      const result = query(req.query);
      if (!result.success) return sendError(res, result.message, 400);
      req.query = result.data;
    }

    if (params) {
      const result = params(req.params);
      if (!result.success) return sendError(res, result.message, 400);
      req.params = result.data;
    }

    next();
  };
