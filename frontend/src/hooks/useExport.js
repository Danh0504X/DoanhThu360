import { useMutation } from '@tanstack/react-query';
import { exportService } from '../services/exportService.js';

export const useExport = () =>
  useMutation({
    mutationFn: exportService.exportRevenueReport,
  });
