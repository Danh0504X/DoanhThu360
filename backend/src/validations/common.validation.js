import mongoose from 'mongoose';

const isEmpty = (value) => value === undefined || value === null || value === '';

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const parseOptionalTrimmedString = (value, maxLength, fieldName) => {
  if (isEmpty(value)) return undefined;
  if (typeof value !== 'string') return `${fieldName} must be a string`;

  const normalized = value.trim();
  if (maxLength && normalized.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }

  return normalized;
};

export const parseRequiredTrimmedString = (value, minLength, maxLength, fieldName) => {
  if (typeof value !== 'string') return `${fieldName} is required`;

  const normalized = value.trim();
  if (!normalized) return `${fieldName} is required`;
  if (minLength && normalized.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (maxLength && normalized.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }

  return normalized;
};

export const parseOptionalEnum = (value, enumValues, fieldName) => {
  if (isEmpty(value)) return undefined;
  if (!enumValues.includes(value)) {
    return `${fieldName} must be one of: ${enumValues.join(', ')}`;
  }

  return value;
};

export const parseOptionalEmail = (value, fieldName) => {
  if (isEmpty(value)) return undefined;
  if (typeof value !== 'string') return `${fieldName} must be a valid email`;

  const normalized = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return `${fieldName} must be a valid email`;
  }

  return normalized;
};

export const parseRequiredDate = (value, fieldName) => {
  if (isEmpty(value)) return `${fieldName} is required`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${fieldName} must be a valid date`;

  return date;
};

export const parseOptionalDate = (value, fieldName) => {
  if (isEmpty(value)) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${fieldName} must be a valid date`;

  return date;
};

export const parseRequiredNumber = (value, fieldName) => {
  if (isEmpty(value)) return `${fieldName} is required`;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return `${fieldName} must be a valid number`;
  if (numberValue < 0) return `${fieldName} must be greater than or equal to 0`;

  return numberValue;
};

export const parseOptionalPositiveInteger = (value, fallback, fieldName) => {
  if (isEmpty(value)) return fallback;

  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return `${fieldName} must be a positive integer`;
  }

  return numberValue;
};

export const parseRequiredObjectId = (value, fieldName) => {
  if (isEmpty(value)) return `${fieldName} is required`;
  if (!isValidObjectId(value)) return `${fieldName} must be a valid ObjectId`;
  return value;
};

export const parseOptionalObjectId = (value, fieldName) => {
  if (isEmpty(value)) return undefined;
  if (!isValidObjectId(value)) return `${fieldName} must be a valid ObjectId`;
  return value;
};

export const buildValidationResult = (data, message) =>
  message ? { success: false, message } : { success: true, data };
