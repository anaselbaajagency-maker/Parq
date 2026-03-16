const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setAuthCookies(token: string, role: string): void {
    setCookie('parq_token', token, COOKIE_MAX_AGE_SECONDS);
    setCookie('parq_role', role, COOKIE_MAX_AGE_SECONDS);
}

export function clearAuthCookies(): void {
    clearCookie('parq_token');
    clearCookie('parq_role');
}
