import { buildValidationResult } from './common.validation.js';

const USER_ROLES = ['user', 'admin'];
const USER_STATUSES = ['active', 'inactive', 'banned'];
const USER_GENDERS = ['Male', 'Female', 'Other'];

const hasOwn = (payload, key) => Object.prototype.hasOwnProperty.call(payload, key);

const parseOptionalString = (value, fieldName, maxLength) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (typeof value !== 'string') return { message: `${fieldName} must be a string` };

  const normalized = value.trim();
  if (maxLength && normalized.length > maxLength) {
    return { message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { value: normalized };
};

const parseOptionalEnum = (value, fieldName, enumValues) => {
  if (value === undefined || value === null || value === '' || value === 'all') return { value: undefined };
  if (!enumValues.includes(value)) {
    return { message: `${fieldName} must be one of: ${enumValues.join(', ')}` };
  }

  return { value };
};

const parseOptionalDate = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return { value: undefined };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { message: `${fieldName} must be a valid date` };

  return { value: date };
};

const parsePositiveInteger = (value, fieldName, fallback, max) => {
  if (value === undefined || value === null || value === '') return { value: fallback };

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return { message: `${fieldName} must be a positive integer` };
  }

  return { value: max ? Math.min(numericValue, max) : numericValue };
};

export const listUsersQuerySchema = (query = {}) => {
  const data = {};

  const role = parseOptionalEnum(query.role, 'role', USER_ROLES);
  if (role.message) return buildValidationResult(null, role.message);
  if (role.value !== undefined) data.role = role.value;

  const status = parseOptionalEnum(query.status, 'status', USER_STATUSES);
  if (status.message) return buildValidationResult(null, status.message);
  if (status.value !== undefined) data.status = status.value;

  const keyword = parseOptionalString(query.keyword, 'keyword', 255);
  if (keyword.message) return buildValidationResult(null, keyword.message);
  if (keyword.value !== undefined) data.keyword = keyword.value;

  const page = parsePositiveInteger(query.page, 'page', 1);
  if (page.message) return buildValidationResult(null, page.message);
  data.page = page.value;

  const limit = parsePositiveInteger(query.limit, 'limit', 10, 100);
  if (limit.message) return buildValidationResult(null, limit.message);
  data.limit = limit.value;

  return buildValidationResult(data);
};

// PATCH /users/:id/admin — role/status plus any of the regular profile fields.
export const adminUpdateUserSchema = (payload = {}) => {
  const data = {};

  if (hasOwn(payload, 'role')) {
    const result = parseOptionalEnum(payload.role, 'role', USER_ROLES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.role = result.value;
  }

  if (hasOwn(payload, 'status')) {
    const result = parseOptionalEnum(payload.status, 'status', USER_STATUSES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.status = result.value;
  }

  if (hasOwn(payload, 'name')) {
    const result = parseOptionalString(payload.name, 'name', 100);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.name = result.value;
  }

  if (hasOwn(payload, 'gender')) {
    const result = parseOptionalEnum(payload.gender, 'gender', USER_GENDERS);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.gender = result.value;
  }

  if (hasOwn(payload, 'dob')) {
    const result = parseOptionalDate(payload.dob, 'dob');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.dob = result.value;
  }

  return buildValidationResult(data);
};
