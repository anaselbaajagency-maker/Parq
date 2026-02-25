'use client';

import React, { ReactNode } from 'react';
import { AlertProvider } from '@/context/AlertContext';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * Client-side providers wrapper for the application.
 * Includes AlertProvider for global toast notifications
 * and ErrorBoundary for catching unhandled render errors.
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <AlertProvider>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </AlertProvider>
    );
}
