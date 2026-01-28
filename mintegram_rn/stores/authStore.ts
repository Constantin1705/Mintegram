import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import { api } from '@/lib/axios';
import { User } from '@/types';

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/api/auth/login/', {
            user: username,
            password,
          });
          
          set({
            access: data.access,
            refresh: data.refresh,
            isLoading: false,
          });
          
          // Set authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          
          // Fetch user info
          await get().fetchMe();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: (error as AxiosError<{ message: string }>).response?.data?.message || errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          access: null,
          refresh: null,
          user: null,
          error: null,
        });
        
        delete api.defaults.headers.common['Authorization'];
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get('/api/auth/me/');
          set({
            user: data,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
          set({
            error: (error as AxiosError<{ message: string }>).response?.data?.message || errorMessage,
            isLoading: false,
          });
          
          // If fetch fails, logout
          get().logout();
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
      }),
    }
  )
);
