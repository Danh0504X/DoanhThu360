import { ApiError } from './ApiError.js';

export { ApiError };

// Backwards-compatible factory. Prefer `ApiError`/its static helpers in new code.
export const createError = (message, statusCode) => new ApiError(message, statusCode);
