export interface RoutePattern {
    pattern: string;
    segmentNames: string[];
    regex: RegExp;
}

const CANONICAL_PATTERNS = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/maintenance',
    '/buy',
    '/buy/:slug',
    '/buy/:slug/:subSlug',
    '/rent',
    '/rent/:slug',
    '/rent/:slug/:subSlug',
    '/annonce/:slug',
    '/annonces',
    '/annonces/:slug',
    '/create',
    '/list',
    '/profil/:id',
    '/tableau-de-bord',
    '/tableau-de-bord/annonces',
    '/tableau-de-bord/annonces/edit/:id',
    '/tableau-de-bord/messages',
    '/tableau-de-bord/settings',
    '/tableau-de-bord/wallet',
    '/tableau-de-bord/wallet/history',
    '/admin',
    '/admin/categories',
    '/admin/featured',
    '/admin/wallets',
    '/admin/maintenance',
    '/admin/payment-methods',
    '/admin/users',
    '/admin/cities',
    '/admin/listings',
    '/admin/listings/create',
    '/admin/homepage',
    '/admin/settings',
] as const;

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compilePattern(pattern: string): RoutePattern {
    if (pattern === '/') {
        return {
            pattern,
            segmentNames: [],
            regex: /^\/$/,
        };
    }

    const parts = pattern.split('/').filter(Boolean);
    const segmentNames: string[] = [];

    const regexSource = parts
        .map((part) => {
            if (part.startsWith(':')) {
                const name = part.slice(1);
                segmentNames.push(name);
                return '([^/]+)';
            }

            return escapeRegex(part);
        })
        .join('/');

    return {
        pattern,
        segmentNames,
        regex: new RegExp(`^/${regexSource}$`),
    };
}

export const ROUTE_PATTERNS: RoutePattern[] = CANONICAL_PATTERNS
    .map(compilePattern)
    .sort((a, b) => b.pattern.length - a.pattern.length);

export interface MatchedRoute {
    pattern: string;
    params: Record<string, string>;
}

export function matchCanonicalPath(pathname: string): MatchedRoute | null {
    const normalized = pathname === '' ? '/' : pathname;

    for (const route of ROUTE_PATTERNS) {
        const match = normalized.match(route.regex);
        if (!match) continue;

        const params: Record<string, string> = {};
        route.segmentNames.forEach((name, index) => {
            params[name] = decodeURIComponent(match[index + 1] || '');
        });

        return {
            pattern: route.pattern,
            params,
        };
    }

    return null;
}
