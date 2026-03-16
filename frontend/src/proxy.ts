import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

export default function (request: any) {
    // console.log('[Proxy] Request to:', request.nextUrl.pathname);
    return createMiddleware(routing)(request);
}

export const config = {
    // Match all app routes except Next internals and static assets.
    matcher: [
        '/',
        '/(ar|fr)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
