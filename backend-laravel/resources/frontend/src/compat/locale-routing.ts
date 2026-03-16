export const SUPPORTED_LOCALES = ['fr', 'ar'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'fr';

export function isSupportedLocale(locale: string | undefined | null): locale is SupportedLocale {
    return Boolean(locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale));
}

function splitPathQueryHash(href: string): { path: string; query: string; hash: string } {
    const hashIndex = href.indexOf('#');
    const queryIndex = href.indexOf('?');

    const endOfPath = [hashIndex, queryIndex]
        .filter((value) => value >= 0)
        .sort((a, b) => a - b)[0] ?? href.length;

    const path = href.slice(0, endOfPath) || '/';
    const query = queryIndex >= 0
        ? href.slice(queryIndex, hashIndex >= 0 && hashIndex > queryIndex ? hashIndex : href.length)
        : '';
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';

    return { path, query, hash };
}

function localizeCanonicalPath(path: string, locale: SupportedLocale): string {
    if (path === '/login') return '/connexion';
    if (path === '/register') return '/inscription';

    if (path === '/forgot-password') {
        return locale === 'ar' ? '/nisyan-kalimat-sir' : '/mot-de-passe-oublie';
    }

    if (path === '/tableau-de-bord/wallet/history') {
        return locale === 'ar'
            ? '/tableau-de-bord/portefeuille/sijil'
            : '/tableau-de-bord/portefeuille/historique';
    }

    if (path === '/tableau-de-bord/wallet') {
        return '/tableau-de-bord/portefeuille';
    }

    if (path === '/tableau-de-bord/settings') {
        return '/tableau-de-bord/parametres';
    }

    if (path === '/admin/settings') {
        return '/admin/parametres';
    }

    if (path === '/rent' || path.startsWith('/rent/')) {
        return path.replace('/rent', '/location');
    }

    if (path === '/buy' || path.startsWith('/buy/')) {
        return path.replace('/buy', '/achat');
    }

    return path;
}

function canonicalizeLocalizedPath(path: string): string {
    if (path === '/connexion') return '/login';
    if (path === '/inscription') return '/register';

    if (path === '/mot-de-passe-oublie' || path === '/nisyan-kalimat-sir') {
        return '/forgot-password';
    }

    if (
        path === '/tableau-de-bord/portefeuille/historique'
        || path === '/tableau-de-bord/portefeuille/sijil'
    ) {
        return '/tableau-de-bord/wallet/history';
    }

    if (path === '/tableau-de-bord/portefeuille') {
        return '/tableau-de-bord/wallet';
    }

    if (path === '/tableau-de-bord/parametres') {
        return '/tableau-de-bord/settings';
    }

    if (path === '/admin/parametres') {
        return '/admin/settings';
    }

    if (path === '/location' || path.startsWith('/location/')) {
        return path.replace('/location', '/rent');
    }

    if (path === '/achat' || path.startsWith('/achat/')) {
        return path.replace('/achat', '/buy');
    }

    return path;
}

export function extractLocaleFromPathname(pathname: string): {
    locale: SupportedLocale;
    hasLocalePrefix: boolean;
    innerPath: string;
} {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const parts = normalizedPath.split('/').filter(Boolean);
    const firstPart = parts[0];

    if (isSupportedLocale(firstPart)) {
        const inner = parts.slice(1).join('/');
        return {
            locale: firstPart,
            hasLocalePrefix: true,
            innerPath: inner ? `/${inner}` : '/',
        };
    }

    return {
        locale: DEFAULT_LOCALE,
        hasLocalePrefix: false,
        innerPath: normalizedPath || '/',
    };
}

export function toCanonicalPath(pathname: string): {
    locale: SupportedLocale;
    hasLocalePrefix: boolean;
    canonicalPath: string;
} {
    const { locale, hasLocalePrefix, innerPath } = extractLocaleFromPathname(pathname);
    return {
        locale,
        hasLocalePrefix,
        canonicalPath: canonicalizeLocalizedPath(innerPath),
    };
}

export function toLocalizedHref(href: string, locale: SupportedLocale): string {
    if (/^(https?:|mailto:|tel:)/.test(href)) {
        return href;
    }

    if (href.startsWith('#')) {
        return href;
    }

    const normalizedHref = href.startsWith('/') ? href : `/${href}`;
    const { path, query, hash } = splitPathQueryHash(normalizedHref);

    if (path === '/api' || path.startsWith('/api/') || path === '/secure' || path.startsWith('/secure/')) {
        return `${path}${query}${hash}`;
    }

    const localeInfo = extractLocaleFromPathname(path);
    if (localeInfo.hasLocalePrefix) {
        return `${path}${query}${hash}`;
    }

    const localizedPath = localizeCanonicalPath(path, locale);
    return `/${locale}${localizedPath === '/' ? '' : localizedPath}${query}${hash}`;
}

export function toCanonicalFromPathname(pathname: string): {
    locale: SupportedLocale;
    canonicalPath: string;
} {
    const { locale, canonicalPath } = toCanonicalPath(pathname);
    return { locale, canonicalPath };
}
