import React, { createContext, useContext, useMemo } from 'react';
import { useRouteState } from './spa-router';
import { DEFAULT_LOCALE, SupportedLocale } from './locale-routing';
import frMessages from '../../messages/fr.json';
import arMessages from '../../messages/ar.json';
import enMessages from '../../messages/en.json';

type TranslationValue = string | number | boolean;
type TranslationValues = Record<string, TranslationValue | null | undefined>;
type MessageTree = Record<string, unknown>;

const MESSAGE_REGISTRY: Record<string, MessageTree> = {
    fr: frMessages as MessageTree,
    ar: arMessages as MessageTree,
    en: enMessages as MessageTree,
};

interface IntlContextValue {
    locale: string;
    messages: MessageTree;
}

const IntlContext = createContext<IntlContextValue>({
    locale: DEFAULT_LOCALE,
    messages: MESSAGE_REGISTRY[DEFAULT_LOCALE],
});

function getMessagesForLocale(locale: string): MessageTree {
    return MESSAGE_REGISTRY[locale] || MESSAGE_REGISTRY[DEFAULT_LOCALE];
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

function interpolate(template: string, values?: TranslationValues): string {
    if (!values) {
        return template;
    }

    return template.replace(/\{(\w+)\}/g, (_fullMatch, key: string) => {
        const value = values[key];
        if (value === undefined || value === null) {
            return '';
        }

        return String(value);
    });
}

interface ProviderProps {
    children: React.ReactNode;
    locale?: string;
    messages?: MessageTree;
}

export function NextIntlClientProvider({ children, locale, messages }: ProviderProps) {
    const routeState = useRouteState();
    const resolvedLocale = locale || routeState.locale;

    const value = useMemo<IntlContextValue>(() => ({
        locale: resolvedLocale,
        messages: messages || getMessagesForLocale(resolvedLocale),
    }), [messages, resolvedLocale]);

    return (
        <IntlContext.Provider value={value}>
            {children}
        </IntlContext.Provider>
    );
}

export function useLocale(): SupportedLocale {
    const { locale } = useContext(IntlContext);
    return (locale as SupportedLocale) || DEFAULT_LOCALE;
}

interface TranslationOptions extends TranslationValues {
    defaultMessage?: string;
}

export function useTranslations(namespace?: string) {
    const { messages } = useContext(IntlContext);

    return (key: string, values?: TranslationOptions): string => {
        const scopedSource = namespace
            ? getNestedValue(messages, namespace)
            : messages;

        const rawValue = getNestedValue(scopedSource, key);
        const defaultMessage = values?.defaultMessage;

        const translation = typeof rawValue === 'string'
            ? rawValue
            : defaultMessage || key;

        return interpolate(translation, values);
    };
}
