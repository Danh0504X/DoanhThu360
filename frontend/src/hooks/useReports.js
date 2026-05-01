import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys.js';
import { reportService } from '../services/reportService.js';

export const useDailyReport = (date) =>
  useQuery({
    queryKey: queryKeys.reports({ type: 'daily', date }),
    queryFn: () => reportService.getDailyReport(date),
    enabled: Boolean(date),
  });

export const useWeeklyReport = (params = {}) =>
  useQuery({
    queryKey: queryKeys.reports({ type: 'weekly', ...params }),
    queryFn: () => reportService.getWeeklyReport(params),
  });

export const useMonthlyReport = (month) =>
  useQuery({
    queryKey: queryKeys.reports({ type: 'monthly', month }),
    queryFn: () => reportService.getMonthlyReport(month),
    enabled: Boolean(month),
  });

export const useTaxReport = (params = {}) =>
  useQuery({
    queryKey: queryKeys.taxReports(params),
    queryFn: () => reportService.getTaxReport(params),
  });
