import { sendError } from '../utils/response.js';

export const validate = ({ body, query, params } = {}) =>
  (req, res, next) => {
    if (body) {
      const result = body(req.body);
      if (!result.success) return sendError(res, result.message, 400);
      Object.defineProperty(req, 'body', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (query) {
      const result = query(req.query);
      if (!result.success) return sendError(res, result.message, 400);
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (params) {
      const result = params(req.params);
      if (!result.success) return sendError(res, result.message, 400);
      Object.defineProperty(req, 'params', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    next();
  };
