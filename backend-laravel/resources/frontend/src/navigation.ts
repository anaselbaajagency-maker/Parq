import { AppLink, useAppPathname, useAppRouter } from './compat/spa-router';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './compat/locale-routing';

export const routing = {
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: 'always',
    localeDetection: false,
};

export const Link = AppLink;

export function usePathname() {
    return useAppPathname();
}

export function useRouter() {
    return useAppRouter();
}

export { redirect } from './compat/spa-router';
