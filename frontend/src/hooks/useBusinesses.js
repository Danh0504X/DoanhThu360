import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessService } from '../services/businessService.js';
import { queryKeys } from '../lib/queryKeys.js';

const invalidateBusinessRelatedQueries = async (queryClient, businessId) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['businesses'] }),
    queryClient.invalidateQueries({ queryKey: ['business'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['revenues'] }),
    businessId ? queryClient.invalidateQueries({ queryKey: queryKeys.business(businessId) }) : Promise.resolve(),
  ]);
};

export const useBusinesses = (params = {}) =>
  useQuery({
    queryKey: queryKeys.businesses(params),
    queryFn: () => businessService.getBusinesses(params),
    select: (response) => ({
      rows: response?.data?.data || [],
      pagination: response?.data?.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 1,
      },
    }),
  });

export const useBusiness = (id) =>
  useQuery({
    queryKey: queryKeys.business(id),
    queryFn: () => businessService.getBusinessById(id),
    enabled: Boolean(id),
    select: (response) => {
      const business = response?.data || null;
      if (!business) return null;

      return {
        ...business,
        name: business.businessName,
        note: business.representativeName || '',
      };
    },
  });

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessService.createBusiness,
    onSuccess: async () => {
      await invalidateBusinessRelatedQueries(queryClient);
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => businessService.updateBusiness(id, data),
    onSuccess: async (_, variables) => {
      await invalidateBusinessRelatedQueries(queryClient, variables?.id);
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessService.deleteBusiness,
    onSuccess: async (_, businessId) => {
      await invalidateBusinessRelatedQueries(queryClient, businessId);
    },
  });
};

export const useChangeBusinessStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => businessService.changeBusinessStatus(id, status),
    onSuccess: async (_, variables) => {
      await invalidateBusinessRelatedQueries(queryClient, variables?.id);
    },
  });
};
