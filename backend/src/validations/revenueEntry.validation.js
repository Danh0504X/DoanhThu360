import mongoose from 'mongoose';
import { buildValidationResult } from './common.validation.js';

const REVENUE_STATUSES = ['draft', 'confirmed'];
const hasOwn = (payload, key) => Object.prototype.hasOwnProperty.call(payload, key);

const parseRequiredObjectId = (value, fieldName) => {
  if (!value) return { message: `${fieldName} is required` };
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { message: `${fieldName} must be a valid ObjectId` };
  }

  return { value };
};

const parseOptionalObjectId = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { message: `${fieldName} must be a valid ObjectId` };
  }

  return { value };
};

const parseRequiredDate = (value, fieldName) => {
  if (!value) return { message: `${fieldName} is required` };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { message: `${fieldName} must be a valid date` };

  return { value: date };
};

const parseOptionalDate = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return { value: undefined };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { message: `${fieldName} must be a valid date` };

  return { value: date };
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

const parseOptionalString = (value, fieldName, maxLength) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (typeof value !== 'string') return { message: `${fieldName} must be a string` };

  const normalized = value.trim();
  if (maxLength && normalized.length > maxLength) {
    return { message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { value: normalized };
};

const parseRequiredAmount = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { message: `${fieldName} is required` };
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return { message: `${fieldName} must be a valid number` };
  if (numericValue < 0) return { message: `${fieldName} must be greater than or equal to 0` };

  return { value: numericValue };
};

const parseOptionalEnum = (value, fieldName, enumValues) => {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (!enumValues.includes(value)) {
    return { message: `${fieldName} must be one of: ${enumValues.join(', ')}` };
  }

  return { value };
};

const parsePositiveInteger = (value, fieldName, fallback) => {
  if (value === undefined || value === null || value === '') return { value: fallback };

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return { message: `${fieldName} must be a positive integer` };
  }

  return { value: numericValue };
};

const parseRevenuePayload = (payload, { partial = false } = {}) => {
  const data = {};

  if (!partial || hasOwn(payload, 'businessId')) {
    const result = partial
      ? parseOptionalObjectId(payload.businessId, 'businessId')
      : parseRequiredObjectId(payload.businessId, 'businessId');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.businessId = result.value;
  }

  if (!partial || hasOwn(payload, 'revenueDate')) {
    const result = partial
      ? parseOptionalDate(payload.revenueDate, 'revenueDate')
      : parseRequiredDate(payload.revenueDate, 'revenueDate');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.revenueDate = result.value;
  }

  if (!partial || hasOwn(payload, 'content')) {
    const result = partial
      ? parseOptionalString(payload.content, 'content', 255)
      : parseRequiredString(payload.content, 'content', 255);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.content = result.value;
  }

  if (!partial || hasOwn(payload, 'cashAmount')) {
    const result = parseRequiredAmount(payload.cashAmount, 'cashAmount');
    if (result.message) return buildValidationResult(null, result.message);
    data.cashAmount = result.value;
  }

  if (!partial || hasOwn(payload, 'bankAmount')) {
    const result = parseRequiredAmount(payload.bankAmount, 'bankAmount');
    if (result.message) return buildValidationResult(null, result.message);
    data.bankAmount = result.value;
  }

  if (!partial || hasOwn(payload, 'note')) {
    const result = parseOptionalString(payload.note, 'note', 1000);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.note = result.value;
  }

  if (!partial || hasOwn(payload, 'status')) {
    const result = parseOptionalEnum(payload.status, 'status', REVENUE_STATUSES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.status = result.value;
  }

  return buildValidationResult(data);
};

export const createRevenueEntrySchema = (payload) => parseRevenuePayload(payload);

export const updateRevenueEntrySchema = (payload) => parseRevenuePayload(payload, { partial: true });

export const listRevenueEntriesQuerySchema = (query) => {
  const data = {};

  if (hasOwn(query, 'businessId')) {
    const result = parseOptionalObjectId(query.businessId, 'businessId');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.businessId = result.value;
  }

  if (hasOwn(query, 'from')) {
    const result = parseOptionalDate(query.from, 'from');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.from = result.value;
  }

  if (hasOwn(query, 'to')) {
    const result = parseOptionalDate(query.to, 'to');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.to = result.value;
  }

  if (hasOwn(query, 'status')) {
    const result = parseOptionalEnum(query.status, 'status', REVENUE_STATUSES);
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.status = result.value;
  }

  const pageResult = parsePositiveInteger(query.page, 'page', 1);
  if (pageResult.message) return buildValidationResult(null, pageResult.message);
  data.page = pageResult.value;

  const limitResult = parsePositiveInteger(query.limit, 'limit', 10);
  if (limitResult.message) return buildValidationResult(null, limitResult.message);
  data.limit = limitResult.value;

  return buildValidationResult(data);
};

export const revenueSummaryQuerySchema = (query) => {
  const data = {};

  if (hasOwn(query, 'businessId')) {
    const result = parseOptionalObjectId(query.businessId, 'businessId');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.businessId = result.value;
  }

  if (hasOwn(query, 'from')) {
    const result = parseOptionalDate(query.from, 'from');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.from = result.value;
  }

  if (hasOwn(query, 'to')) {
    const result = parseOptionalDate(query.to, 'to');
    if (result.message) return buildValidationResult(null, result.message);
    if (result.value !== undefined) data.to = result.value;
  }

  return buildValidationResult(data);
};
