type ErrorWithMessage = {
    message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null) {
        const maybeError = error as ErrorWithMessage;
        if (typeof maybeError.message === 'string' && maybeError.message.length > 0) {
            return maybeError.message;
        }
    }

    return fallback;
}
