const AUTH_STORAGE_KEY = 'parq-auth';

interface PersistedAuthState {
    state?: {
        token?: string | null;
    };
}

function parseToken(storageValue: string | null): string | null {
    if (!storageValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(storageValue) as PersistedAuthState;
        return parsed.state?.token || null;
    } catch {
        return null;
    }
}

function migrateLegacyAuthStorage(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const sessionValue = sessionStorage.getItem(AUTH_STORAGE_KEY);
    const legacyLocalValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!sessionValue && legacyLocalValue) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, legacyLocalValue);
    }

    if (legacyLocalValue) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    migrateLegacyAuthStorage();
    const sessionValue = sessionStorage.getItem(AUTH_STORAGE_KEY);

    return parseToken(sessionValue);
}

