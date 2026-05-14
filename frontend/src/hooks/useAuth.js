import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { authService } from '../services/authService.js';
import { queryKeys } from '../lib/queryKeys.js';
import { authStore } from '../stores/authStore.js';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rememberMe = false, ...payload }) => {
      const response = await authService.login(payload);
      return {
        response,
        rememberMe,
      };
    },
    onSuccess: ({ response, rememberMe }) => {
      const responseData = response?.data || response;
      authStore.setSession({
        accessToken: responseData?.accessToken || null,
        refreshToken: responseData?.refreshToken || null,
        user: responseData?.user || null,
        rememberMe,
      });
      queryClient.setQueryData(queryKeys.currentUser, responseData?.user || null);
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: authService.register,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: authService.forgotPassword,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: authService.resetPassword,
  });

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      authStore.clearSession();
      queryClient.setQueryData(queryKeys.currentUser, null);
      queryClient.removeQueries();
    },
  });
};

export const useAuth = () => {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user: state.user,
    isAuthenticated: Boolean(state.token),
    isLoading: state.isAuthLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
    logoutStatus: logoutMutation.status,
  };
};
