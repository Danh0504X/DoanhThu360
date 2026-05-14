import { useMutation } from '@tanstack/react-query';
import { exportReportService } from '../services/exportReportService.js';

export const useExportRevenueWord = () =>
  useMutation({
    mutationFn: exportReportService.exportRevenueWord,
  });
