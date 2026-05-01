import { useQuery } from '@tanstack/react-query';
import { businessService } from '../services/businessService.js';

export const useBusinesses = (params = {}) =>
  useQuery({
    queryKey: ['businesses', params],
    queryFn: () => businessService.getBusinesses(params),
    select: (response) => response?.data || [],
  });
