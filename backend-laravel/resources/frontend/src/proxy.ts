import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

export default createMiddleware(routing);

export const config = {
    // Match all app routes except API, Next internals and static assets.
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
