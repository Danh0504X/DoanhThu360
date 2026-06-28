import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService.js';
import { queryKeys } from '../lib/queryKeys.js';

export const useProfile = () =>
  useQuery({
    queryKey: queryKeys.profile,
    queryFn: accountService.getProfile,
    select: (response) => response?.data || null,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.updateProfile,
    onSuccess: async (response) => {
      const profile = response?.data || null;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
      ]);

      if (profile) {
        queryClient.setQueryData(queryKeys.currentUser, (currentUser) => ({
          ...(currentUser || {}),
          name: profile.fullName,
          email: profile.email,
          dob: profile.birthDate,
          emailVerified: profile.emailVerified,
          preferences: {
            ...(currentUser?.preferences || {}),
            phone: profile.phone,
          },
        }));
      }
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: accountService.changePassword,
  });

export const useSendVerificationCode = () =>
  useMutation({
    mutationFn: accountService.sendVerificationCode,
  });

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.verifyEmail,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
      ]);
    },
  });
};

export const useRecentActivities = () =>
  useQuery({
    queryKey: queryKeys.recentActivities,
    queryFn: accountService.getRecentActivities,
    select: (response) => response?.data || [],
  });
