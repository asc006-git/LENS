import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data: response } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
          const result = response.data || response;
          set({
            user: result.user,
            token: result.accessToken || result.token,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const { data: response } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
          const result = response.data || response;
          set({
            user: result.user,
            token: result.accessToken || result.token,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        const { token } = get();
        if (token) {
          apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {});
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setTokens: (token: string, refreshToken: string) => {
        set({ token, refreshToken });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'lens-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
