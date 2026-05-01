export const createError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });
