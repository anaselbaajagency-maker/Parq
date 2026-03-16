import frMessages from '../../messages/fr.json';
import arMessages from '../../messages/ar.json';
import enMessages from '../../messages/en.json';
import { DEFAULT_LOCALE, SupportedLocale } from './locale-routing';

type MessageTree = Record<string, unknown>;

const MESSAGE_REGISTRY: Record<string, MessageTree> = {
    fr: frMessages as MessageTree,
    ar: arMessages as MessageTree,
    en: enMessages as MessageTree,
};

function resolveLocale(locale?: string): SupportedLocale {
    if (locale === 'ar' || locale === 'fr') {
        return locale;
    }

    return DEFAULT_LOCALE;
}

function getNestedValue(source: unknown, path: string): unknown {
    if (!path) return source;

    return path.split('.').reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object') {
            return undefined;
        }

        return (current as Record<string, unknown>)[segment];
    }, source);
}

export function setRequestLocale(_locale: string): void {
    // No-op in client-only SPA mode.
}

export async function getMessages(options?: { locale?: string }): Promise<MessageTree> {
    const locale = resolveLocale(options?.locale);
    return MESSAGE_REGISTRY[locale] || MESSAGE_REGISTRY[DEFAULT_LOCALE];
}

export async function getTranslations(namespace?: string, options?: { locale?: string }) {
    const messages = await getMessages(options);
    const scoped = namespace ? getNestedValue(messages, namespace) : messages;

    return (key: string, values?: { defaultMessage?: string; [k: string]: unknown }) => {
        const translation = getNestedValue(scoped, key);
        if (typeof translation === 'string') {
            return translation;
        }

        return values?.defaultMessage || key;
    };
}

export function getRequestConfig<T>(factory: (ctx: { requestLocale?: Promise<string | undefined> }) => T): T {
    return factory({
        requestLocale: Promise.resolve(DEFAULT_LOCALE),
    });
}
