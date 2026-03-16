type ErrorContext = Record<string, unknown>;

interface ParsedSentryDsn {
    endpoint: string;
    authHeader: string;
}

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function createRequestId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export async function captureClientError(error: unknown, context: ErrorContext = {}): Promise<void> {
    const sentryTarget = parseSentryDsn(sentryDsn);
    if (!sentryTarget) {
        return;
    }

    const normalizedError = normalizeError(error);
    const eventId = createEventId();

    const payload = {
        event_id: eventId,
        platform: 'javascript',
        level: 'error',
        environment: process.env.NODE_ENV,
        timestamp: Math.floor(Date.now() / 1000),
        message: normalizedError.message,
        exception: {
            values: [
                {
                    type: normalizedError.type,
                    value: normalizedError.message,
                    stacktrace: normalizedError.stack,
                },
            ],
        },
        request: {
            url: typeof window !== 'undefined' ? window.location.href : undefined,
        },
        extra: context,
    };

    try {
        await fetch(sentryTarget.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentry-Auth': sentryTarget.authHeader,
            },
            body: JSON.stringify(payload),
        });
    } catch {
        // Never block app execution due to observability transport failures.
    }
}

function parseSentryDsn(dsn?: string): ParsedSentryDsn | null {
    if (!dsn) {
        return null;
    }

    try {
        const parsed = new URL(dsn);
        const projectId = parsed.pathname.replace(/\//g, '');
        if (!projectId || !parsed.username) {
            return null;
        }

        const endpoint = `${parsed.protocol}//${parsed.host}/api/${projectId}/store/`;
        const authHeader = `Sentry sentry_version=7, sentry_key=${parsed.username}, sentry_client=parqv2-frontend/1.0`;

        return { endpoint, authHeader };
    } catch {
        return null;
    }
}

function normalizeError(error: unknown): { type: string; message: string; stack?: string } {
    if (error instanceof Error) {
        return {
            type: error.name || 'Error',
            message: error.message,
            stack: error.stack,
        };
    }

    return {
        type: 'UnknownError',
        message: typeof error === 'string' ? error : 'Unknown client error',
    };
}

function createEventId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().replace(/-/g, '');
    }

    return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`.slice(0, 32);
}
