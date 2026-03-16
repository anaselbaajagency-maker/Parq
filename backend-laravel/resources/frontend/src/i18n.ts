import { getRequestConfig } from 'next-intl/server';
import { routing } from './navigation';

type AppLocale = (typeof routing.locales)[number];

function isAppLocale(locale: string): locale is AppLocale {
    return routing.locales.includes(locale as AppLocale);
}

export default getRequestConfig(async ({ requestLocale }) => {
    // For static export, get locale from route params
    let locale = await requestLocale;

    // Validate locale against supported locales
    if (!locale || !isAppLocale(locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
