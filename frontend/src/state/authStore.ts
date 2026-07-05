import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

const mapBackendUser = (backendUser: any): User | null => {
  if (!backendUser) return null;
  const nameParts = (backendUser.name || '').trim().split(/\s+/);
  return {
    ...backendUser,
    id: backendUser.id || backendUser._id,
    firstName: backendUser.firstName || nameParts[0] || '',
    lastName: backendUser.lastName || nameParts.slice(1).join(' ') || '',
    role: backendUser.role,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  };
};

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
            user: mapBackendUser(result.user),
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
          // Map frontend RegisterData (firstName/lastName) to backend expects (name)
          const name = `${registerData.firstName} ${registerData.lastName}`.trim();
          const backendRegisterData = {
            name,
            email: registerData.email,
            password: registerData.password,
            role: registerData.role,
            institution: registerData.institution,
            department: registerData.department,
          };

          const { data: response } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, backendRegisterData);
          const result = response.data || response;
          set({
            user: mapBackendUser(result.user),
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
