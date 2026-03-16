import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearAuthCookies, setAuthCookies } from './auth-cookie';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
    phone?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hasHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            hasHydrated: false,
            setAuth: (user, token) => {
                setAuthCookies(token, user.role);
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                clearAuthCookies();
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'parq-auth',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                if (typeof window === 'undefined') return;
                const legacyAuth = localStorage.getItem('parq-auth');
                const sessionAuth = sessionStorage.getItem('parq-auth');

                if (!sessionAuth && legacyAuth) {
                    sessionStorage.setItem('parq-auth', legacyAuth);
                }

                if (legacyAuth) {
                    localStorage.removeItem('parq-auth');
                }

                if (state?.token && state.user?.role) {
                    setAuthCookies(state.token, state.user.role);
                } else {
                    clearAuthCookies();
                }

                useAuthStore.setState({ hasHydrated: true });
            },
        }
    )
);
