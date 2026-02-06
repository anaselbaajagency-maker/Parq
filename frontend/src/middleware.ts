import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

// The next-intl middleware handles locale routing
const intlMiddleware = createMiddleware(routing);

// Paths that should NEVER be blocked by maintenance mode
const MAINTENANCE_EXCLUDED_PATHS = [
    '/admin',           // Admin panel must remain accessible
    '/api',             // API routes
    '/maintenance',     // The maintenance page itself
    '/siyana',          // Arabic maintenance route
    '/dashboard',       // User dashboard
    '/tableau-de-bord', // French dashboard route
    '/lawhat-tahakum',  // Arabic dashboard route
    '/_next',           // Next.js internals
    '/favicon.ico',
];

// Helper to check if path should be excluded from maintenance
function isExcludedPath(pathname: string): boolean {
    return MAINTENANCE_EXCLUDED_PATHS.some(excluded =>
        pathname.includes(excluded)
    );
}

// Server-side fetch for settings (with no cache)
async function fetchMaintenanceStatus(): Promise<boolean> {
    try {
        // Use environment variable or fallback
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

        const response = await fetch(`${apiUrl}/settings`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('[Middleware] Failed to fetch settings:', response.status);
            return false; // Default to NOT maintenance if API fails
        }

        const settings = await response.json();
        const mode = settings?.maintenance_mode;

        // Check all possible truthy values
        return mode === true || mode === 'true' || mode === '1' || mode === 1;
    } catch (error) {
        console.error('[Middleware] Error fetching maintenance status:', error);
        return false; // Default to NOT maintenance if API fails
    }
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Step 1: Check if this path should bypass maintenance check
    if (isExcludedPath(pathname)) {
        // Just run the intl middleware for locale handling
        return intlMiddleware(request);
    }

    // Step 2: Check maintenance status from backend
    const isMaintenanceMode = await fetchMaintenanceStatus();

    if (isMaintenanceMode) {
        // Step 3: Redirect to maintenance page
        // Extract locale from path or use default
        const localeMatch = pathname.match(/^\/(ar|fr)/);
        const locale = localeMatch ? localeMatch[1] : 'fr';

        // Build maintenance URL
        const maintenanceUrl = new URL(`/${locale}/maintenance`, request.url);

        // Return 503 status with redirect
        return NextResponse.rewrite(maintenanceUrl, {
            status: 503,
            headers: {
                'Retry-After': '3600', // Suggest retry after 1 hour
            },
        });
    }

    // Step 4: No maintenance, proceed with normal intl middleware
    return intlMiddleware(request);
}

export const config = {
    // Match all paths except static files
    matcher: ['/', '/(ar|fr)/:path*'],
};
