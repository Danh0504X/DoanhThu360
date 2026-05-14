import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authStore } from '../stores/authStore.js';
import { authService } from '../services/authService.js';
import { getRefreshToken } from '../utils/tokenStorage.js';
import { rawApi } from '../lib/api.js';

export const useAuthBootstrap = () => {
  const queryClient = useQueryClient();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const bootstrap = async () => {
      const { token } = authStore.getSnapshot();
      const refreshToken = getRefreshToken();

      // If no tokens, we are just logged out
      if (!token && !refreshToken) {
        authStore.setAuthLoading(false);
        return;
      }

      try {
        let currentToken = token;

        // If we don't have an access token but have a refresh token, try to refresh immediately
        if (!currentToken && refreshToken) {
          const res = await rawApi.post('/auth/refresh-token', { refreshToken });
          currentToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;
          
          authStore.setSession({
            accessToken: currentToken,
            refreshToken: newRefreshToken || refreshToken,
            user: authStore.getSnapshot().user,
            rememberMe: localStorage.getItem('rememberMe') === 'true',
          });
        }

        // Fetch current user using the valid access token
        const response = await authService.getMe();
        const user = response?.data || response;
        
        authStore.setUser(user);
        queryClient.setQueryData(['currentUser'], user);
      } catch (error) {
        console.error('Auth bootstrap failed:', error);
        authStore.clearSession();
      } finally {
        authStore.setAuthLoading(false);
      }
    };

    bootstrap();
  }, [queryClient]);
};
