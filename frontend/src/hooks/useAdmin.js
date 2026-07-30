import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService.js';
import { settingsService } from '../services/settingsService.js';
import { queryKeys } from '../lib/queryKeys.js';

export const useAdminStats = () =>
  useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: () => adminService.getStats(),
    select: (response) => response?.data || null,
  });

export const useAdminUsers = (params = {}) =>
  useQuery({
    queryKey: queryKeys.adminUsers(params),
    queryFn: () => adminService.getUsers(params),
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

const invalidateAdminUsers = async (queryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.adminStats }),
  ]);
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateUser(id, data),
    onSuccess: () => invalidateAdminUsers(queryClient),
  });
};

// Toggle block/unblock or change role — both go through PATCH /:id/admin.
export const useAdminUpdateUserRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminService.adminUpdateUser(id, data),
    onSuccess: () => invalidateAdminUsers(queryClient),
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: () => invalidateAdminUsers(queryClient),
  });
};

export const useAppSettings = () =>
  useQuery({
    queryKey: queryKeys.appSettings,
    queryFn: () => settingsService.getSettings(),
    select: (response) => response?.data || null,
  });

export const useUpdateAppSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch) => settingsService.updateSettings(patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.appSettings }),
  });
};

// Used by the public register page — no auth required for this endpoint.
export const usePublicRegistrationStatus = () =>
  useQuery({
    queryKey: queryKeys.publicRegistrationStatus,
    queryFn: () => settingsService.getPublicRegistrationStatus(),
    select: (response) => response?.data?.registrationEnabled ?? true,
    staleTime: 60_000,
  });
