import { dashboardService } from './dashboardService.js';

export const reportService = {
  getDailyReport(date) {
    return dashboardService.getDashboardStats({
      from: date,
      to: date,
      period: 'day',
    });
  },

  getWeeklyReport(params = {}) {
    return dashboardService.getRevenueChart(params);
  },

  getMonthlyReport(month) {
    return dashboardService.getRevenueChart({
      period: 'month',
      month,
    });
  },

  getTaxReport(params = {}) {
    return dashboardService.getDashboardStats(params);
  },
};
