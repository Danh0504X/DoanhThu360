import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys.js';
import { dashboardService } from '../services/dashboardService.js';

export const useDashboardStats = (params = {}) =>
  useQuery({
    queryKey: queryKeys.dashboard(params),
    queryFn: () => dashboardService.getDashboardStats(params),
    select: (response) => response?.data || {
      totalCash: 0,
      totalBank: 0,
      totalRevenue: 0,
      count: 0,
    },
  });

export const useRevenueChart = (params = {}) =>
  useQuery({
    queryKey: queryKeys.dashboardChart(params),
    queryFn: () => dashboardService.getRevenueChart(params),
    select: (response) =>
      (response?.data || []).map((item) => ({
        label: item.date,
        revenue: item.totalRevenue,
        cash: item.totalCash,
        bank: item.totalBank,
      })),
  });

export const useRecentRevenues = (params = {}) =>
  useQuery({
    queryKey: queryKeys.dashboardRecentRevenues(params),
    queryFn: () => dashboardService.getRecentRevenues(params),
    select: (response) => ({
      rows: (response?.data || []).map((item) => ({
        id: item._id,
        date: item.revenueDate,
        content: item.content,
        cashAmount: item.cashAmount,
        bankAmount: item.bankAmount,
        totalAmount: item.totalAmount,
        note: item.note,
      })),
      pagination: response?.pagination || null,
    }),
  });
