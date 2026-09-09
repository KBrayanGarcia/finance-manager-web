import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  readonly token: string | null;
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly setAuth: (params: { readonly token: string; readonly user: User }) => void;
  readonly updateUser: (user: Partial<User>) => void;
  readonly logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ token, user }) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'finance-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
