import { reportService } from './reportService.js';

export const exportService = {
  async exportRevenueReport(params = {}) {
    const report = await reportService.getTaxReport(params);
    return report?.data || report;
  },
};
