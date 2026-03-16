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

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const localValue = localStorage.getItem(AUTH_STORAGE_KEY);
    const token = parseToken(localValue);
    // console.log('[AuthToken] Retrieved from localStorage:', token ? 'FOUND (starts with ' + token.substring(0, 10) + '...)' : 'NOT FOUND');
    return token;
}

