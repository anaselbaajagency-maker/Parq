interface CookieValue {
    value: string;
}

interface CookieStore {
    get: (name: string) => CookieValue | undefined;
}

function parseCookieValue(name: string): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const matched = cookies.find((entry) => entry.startsWith(`${name}=`));

    if (!matched) {
        return undefined;
    }

    return decodeURIComponent(matched.split('=').slice(1).join('='));
}

export function cookies(): CookieStore {
    return {
        get(name: string) {
            const value = parseCookieValue(name);
            if (value === undefined) {
                return undefined;
            }

            return { value };
        },
    };
}

export function headers(): Headers {
    return new Headers();
}
