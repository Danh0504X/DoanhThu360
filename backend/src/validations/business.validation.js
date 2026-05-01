import { buildValidationResult } from './common.validation.js';

const BUSINESS_TYPES = ['household', 'company', 'store', 'online_shop', 'other'];
const BUSINESS_STATUSES = ['active', 'inactive'];

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

const parseRequiredString = (value, fieldName, maxLength) => {
  if (typeof value !== 'string') return { message: `${fieldName} is required` };

  const normalized = value.trim();
  if (!normalized) return { message: `${fieldName} is required` };
  if (maxLength && normalized.length > maxLength) {
    return { message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { value: normalized };
};

const parseOptionalEnum = (value, fieldName, enumValues) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (!enumValues.includes(value)) {
    return { message: `${fieldName} must be one of: ${enumValues.join(', ')}` };
  }

  return { value };
};

const parseOptionalEmail = (value) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (typeof value !== 'string') return { message: 'email must be a valid email' };

  const normalized = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { message: 'email must be a valid email' };
  }

  return { value: normalized };
};

const parseBusinessPayload = (payload, { partial = false } = {}) => {
  const data = {};

  if (!partial || hasOwn(payload, 'businessName')) {
    const result = partial
      ? parseOptionalString(payload.businessName, 'businessName', 255)
      : parseRequiredString(payload.businessName, 'businessName', 255);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.businessName = result.value;
  }

  const fieldParsers = [
    ['taxCode', 255],
    ['address', 500],
    ['phone', 50],
    ['representativeName', 255],
  ];

  for (const [fieldName, maxLength] of fieldParsers) {
    if (!partial || hasOwn(payload, fieldName)) {
      const result = parseOptionalString(payload[fieldName], fieldName, maxLength);
      if (result.message) return buildValidationResult(null, result.message);
      if (result.value !== undefined) data[fieldName] = result.value;
    }
  }

  if (!partial || hasOwn(payload, 'businessType')) {
    const result = parseOptionalEnum(payload.businessType, 'businessType', BUSINESS_TYPES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.businessType = result.value;
  }

  if (!partial || hasOwn(payload, 'status')) {
    const result = parseOptionalEnum(payload.status, 'status', BUSINESS_STATUSES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.status = result.value;
  }

  if (!partial || hasOwn(payload, 'email')) {
    const result = parseOptionalEmail(payload.email);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.email = result.value;
  }

  return buildValidationResult(data);
};

export const createBusinessSchema = (payload) => parseBusinessPayload(payload);

export const updateBusinessSchema = (payload) => parseBusinessPayload(payload, { partial: true });

export const listBusinessesQuerySchema = (query) => {
  const data = {};

  if (hasOwn(query, 'status')) {
    const result = parseOptionalEnum(query.status, 'status', BUSINESS_STATUSES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.status = result.value;
  }

  return buildValidationResult(data);
};
