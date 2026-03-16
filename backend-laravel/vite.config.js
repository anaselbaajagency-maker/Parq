import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/frontend/src/main.tsx'],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/frontend/src'),
            'next/navigation': path.resolve(__dirname, 'resources/frontend/src/compat/next-navigation.ts'),
            'next/link': path.resolve(__dirname, 'resources/frontend/src/compat/next-link.tsx'),
            'next/image': path.resolve(__dirname, 'resources/frontend/src/compat/next-image.tsx'),
            'next/dynamic': path.resolve(__dirname, 'resources/frontend/src/compat/next-dynamic.tsx'),
            'next/web-vitals': path.resolve(__dirname, 'resources/frontend/src/compat/next-web-vitals.ts'),
            'next/headers': path.resolve(__dirname, 'resources/frontend/src/compat/next-headers.ts'),
            'next-intl': path.resolve(__dirname, 'resources/frontend/src/compat/next-intl.tsx'),
            'next-intl/server': path.resolve(__dirname, 'resources/frontend/src/compat/next-intl-server.ts'),
        },
    },
    define: {
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
        'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(process.env.VITE_SENTRY_DSN || ''),
        'process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT': JSON.stringify(process.env.VITE_WEB_VITALS_ENDPOINT || ''),
        'process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || ''),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
});
