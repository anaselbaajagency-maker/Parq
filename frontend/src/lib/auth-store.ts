import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearAuthCookies, setAuthCookies } from './auth-cookie';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
    phone?: string;
    email_verified_at?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => {
                setAuthCookies(token, user.role);
                set({ user, token, isAuthenticated: true });
            },
            updateUser: (updatedUser) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null
                }));
            },
            logout: () => {
                clearAuthCookies();
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'parq-auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (typeof window === 'undefined') return;

                // Sync cookies only if we actually have valid auth data
                if (state?.token && state.user?.role) {
                    setAuthCookies(state.token, state.user.role);
                }
                // Do NOT clear cookies here blindly on every rehydration start
                // clearAuthCookies() should only happen on explicit logout
            },
        }
    )
);
