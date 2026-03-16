import React, { useCallback, useMemo, useSyncExternalStore } from 'react';
import { matchCanonicalPath } from './route-patterns';
import { DEFAULT_LOCALE, extractLocaleFromPathname, isSupportedLocale, SupportedLocale, toCanonicalPath, toLocalizedHref } from './locale-routing';

const NAVIGATION_EVENT = 'parq:navigation';

interface BrowserLocationState {
    pathname: string;
    search: string;
    hash: string;
}

function getBrowserLocation(): BrowserLocationState {
    if (typeof window === 'undefined') {
        return {
            pathname: '/',
            search: '',
            hash: '',
        };
    }

    return {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
    };
}

function subscribeToLocation(onStoreChange: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    window.addEventListener('popstate', onStoreChange);
    window.addEventListener(NAVIGATION_EVENT, onStoreChange);

    return () => {
        window.removeEventListener('popstate', onStoreChange);
        window.removeEventListener(NAVIGATION_EVENT, onStoreChange);
    };
}

function dispatchNavigationEvent(): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

function isExternalHref(href: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(href);
}

function navigate(href: string, replace = false): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (isExternalHref(href)) {
        if (replace) {
            window.location.replace(href);
        } else {
            window.location.assign(href);
        }
        return;
    }

    if (href.startsWith('#')) {
        const current = `${window.location.pathname}${window.location.search}${href}`;
        if (replace) {
            window.history.replaceState(null, '', current);
        } else {
            window.history.pushState(null, '', current);
        }
        dispatchNavigationEvent();
        return;
    }

    const target = href.startsWith('/') ? href : `/${href}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (target === current) {
        dispatchNavigationEvent();
        return;
    }

    if (replace) {
        window.history.replaceState(null, '', target);
    } else {
        window.history.pushState(null, '', target);
    }

    window.scrollTo(0, 0);
    dispatchNavigationEvent();
}

export interface RouteState {
    location: BrowserLocationState;
    locale: SupportedLocale;
    hasLocalePrefix: boolean;
    canonicalPath: string;
    params: Record<string, string>;
    routePattern: string | null;
}

export function useRouteState(): RouteState {
    const location = useSyncExternalStore(subscribeToLocation, getBrowserLocation, getBrowserLocation);
    const { locale, canonicalPath, hasLocalePrefix } = toCanonicalPath(location.pathname);
    const matchedRoute = matchCanonicalPath(canonicalPath);

    const params = {
        locale,
        ...(matchedRoute?.params ?? {}),
    };

    return {
        location,
        locale,
        hasLocalePrefix,
        canonicalPath,
        params,
        routePattern: matchedRoute?.pattern ?? null,
    };
}

interface RouterNavigationOptions {
    locale?: string;
}

export interface AppRouter {
    push: (href: string, options?: RouterNavigationOptions) => void;
    replace: (href: string, options?: RouterNavigationOptions) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (_href: string) => Promise<void>;
}

function resolveLocale(currentLocale: SupportedLocale, overrideLocale?: string): SupportedLocale {
    if (overrideLocale && isSupportedLocale(overrideLocale)) {
        return overrideLocale;
    }

    return currentLocale;
}

export function useAppRouter(): AppRouter {
    const { locale } = useRouteState();

    return useMemo<AppRouter>(() => ({
        push: (href, options) => {
            const targetLocale = resolveLocale(locale, options?.locale);
            navigate(toLocalizedHref(href, targetLocale));
        },
        replace: (href, options) => {
            const targetLocale = resolveLocale(locale, options?.locale);
            navigate(toLocalizedHref(href, targetLocale), true);
        },
        refresh: () => {
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        },
        back: () => {
            if (typeof window !== 'undefined') {
                window.history.back();
            }
        },
        forward: () => {
            if (typeof window !== 'undefined') {
                window.history.forward();
            }
        },
        prefetch: async () => {
            // No-op in SPA mode.
        },
    }), [locale]);
}

interface AppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    locale?: string;
    replace?: boolean;
}

export function AppLink({
    href,
    locale,
    replace,
    onClick,
    target,
    rel,
    ...rest
}: AppLinkProps): React.JSX.Element {
    const routeState = useRouteState();
    const targetLocale = resolveLocale(routeState.locale, locale);
    const localizedHref = toLocalizedHref(href, targetLocale);

    const safeRel = target === '_blank'
        ? rel || 'noopener noreferrer'
        : rel;

    const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (
            event.button !== 0
            || event.metaKey
            || event.altKey
            || event.ctrlKey
            || event.shiftKey
            || target === '_blank'
            || isExternalHref(localizedHref)
        ) {
            return;
        }

        event.preventDefault();
        navigate(localizedHref, Boolean(replace));
    }, [localizedHref, onClick, replace, target]);

    return (
        <a
            {...rest}
            href={localizedHref}
            target={target}
            rel={safeRel}
            onClick={handleClick}
        />
    );
}

export function useAppPathname(): string {
    return useRouteState().canonicalPath;
}

export function useAppParams<T extends Record<string, string | string[]>>(): T {
    return useRouteState().params as T;
}

export function useAppSearchParams(): URLSearchParams {
    const { location } = useRouteState();
    return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

export function redirect(href: string): never {
    if (typeof window !== 'undefined') {
        const { locale } = extractLocaleFromPathname(window.location.pathname);
        const targetLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
        navigate(toLocalizedHref(href, targetLocale), true);
    }

    throw new Error('REDIRECT');
}

export function notFound(): never {
    throw new Error('NOT_FOUND');
}

export function forceNavigationRefresh(): void {
    dispatchNavigationEvent();
}
