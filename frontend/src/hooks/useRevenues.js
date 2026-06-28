import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys.js';
import { revenueService } from '../services/revenueService.js';

const invalidateRevenueRelatedQueries = async (queryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['revenues'] }),
    queryClient.invalidateQueries({ queryKey: ['revenueSummary'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  ]);
};

export const useRevenues = (params = {}) =>
  useQuery({
    queryKey: queryKeys.revenues(params),
    queryFn: () => revenueService.getRevenues(params),
    select: (response) => ({
      rows: response?.data || [],
      pagination: response?.pagination || {
        page: 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 1,
      },
      message: response?.message || '',
    }),
  });

export const useRevenue = (id) =>
  useQuery({
    queryKey: queryKeys.revenue(id),
    queryFn: () => revenueService.getRevenueById(id),
    enabled: Boolean(id),
    select: (response) => response?.data || null,
  });

export const useRevenueSummary = (params = {}) =>
  useQuery({
    queryKey: queryKeys.revenueSummary(params),
    queryFn: () => revenueService.getRevenueSummary(params),
    select: (response) => response?.data || {
      totalCash: 0,
      totalBank: 0,
      totalRevenue: 0,
      count: 0,
    },
  });

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revenueService.createRevenue,
    onSuccess: async () => {
      await invalidateRevenueRelatedQueries(queryClient);
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => revenueService.updateRevenue(id, data),
    onSuccess: async (_, variables) => {
      await invalidateRevenueRelatedQueries(queryClient);
      if (variables?.id) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.revenue(variables.id) });
      }
    },
  });
};

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revenueService.deleteRevenue,
    onSuccess: async () => {
      await invalidateRevenueRelatedQueries(queryClient);
    },
  });
};
