type CookieStoreLike = {
    get(name: string): { value: string } | undefined;
};

export interface ServerAuthState {
    token: string | null;
    role: string | null;
    isAuthenticated: boolean;
}

export function getServerAuthState(cookieStore: CookieStoreLike): ServerAuthState {
    const rawToken = cookieStore.get('parq_token')?.value;
    const rawRole = cookieStore.get('parq_role')?.value;

    const token = rawToken ? decodeURIComponent(rawToken) : null;
    const role = rawRole ? decodeURIComponent(rawRole) : null;

    return {
        token,
        role,
        isAuthenticated: Boolean(token)
    };
}
