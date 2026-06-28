/**
 * Wraps an async route handler so any rejected promise is forwarded to the
 * central error handler via next(). Removes repetitive try/catch in controllers.
 *
 *   export const getThing = asyncHandler(async (req, res) => { ... });
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
