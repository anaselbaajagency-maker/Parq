'use client';

import React, { ReactNode, Suspense } from 'react';
import { AlertProvider } from '@/context/AlertContext';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * Client-side providers wrapper for the application.
 * Simplified as much as possible to avoid hydration mismatches.
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <AlertProvider>
            <ErrorBoundary>
                <Suspense fallback={null}>
                    <div className="app-client-root">
                        {children}
                    </div>
                </Suspense>
            </ErrorBoundary>
        </AlertProvider>
    );
}
