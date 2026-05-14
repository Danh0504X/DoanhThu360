import mongoose from 'mongoose';
import { buildValidationResult } from './common.validation.js';

const REPORT_PERIOD_TYPES = ['month', 'year'];
const DATE_MONTH_REGEX = /^\d{4}-\d{2}$/;
const YEAR_REGEX = /^\d{4}$/;

export const exportRevenueWordQuerySchema = (query) => {
  const businessId = query.businessId;
  if (!businessId || typeof businessId !== 'string') {
    return buildValidationResult(null, 'businessId is required');
  }
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return buildValidationResult(null, 'businessId must be a valid ObjectId');
  }

  const periodType = query.periodType;
  if (!REPORT_PERIOD_TYPES.includes(periodType)) {
    return buildValidationResult(null, 'periodType must be one of: month, year');
  }

  const value = query.value;
  if (!value || typeof value !== 'string') {
    return buildValidationResult(null, 'value is required');
  }

  if (periodType === 'month' && !DATE_MONTH_REGEX.test(value)) {
    return buildValidationResult(null, 'value must be in YYYY-MM format for monthly export');
  }

  if (periodType === 'year' && !YEAR_REGEX.test(value)) {
    return buildValidationResult(null, 'value must be in YYYY format for yearly export');
  }

  return buildValidationResult({
    businessId: businessId.trim(),
    periodType,
    value: value.trim(),
  });
};
