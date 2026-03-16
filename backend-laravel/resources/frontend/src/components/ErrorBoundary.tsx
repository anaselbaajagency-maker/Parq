'use client';

import React, { Component, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import { captureClientError } from '@/lib/monitoring';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught:', error, errorInfo);
        captureClientError(error, {
            scope: 'react_error_boundary',
            component_stack: errorInfo.componentStack,
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.iconWrap}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className={styles.title}>Something went wrong</h2>
                        <p className={styles.description}>
                            An unexpected error occurred. Please try again.
                        </p>
                        {this.state.error && (
                            <details className={styles.details}>
                                <summary>Technical details</summary>
                                <pre>{this.state.error.message}</pre>
                            </details>
                        )}
                        <button onClick={this.handleRetry} className={styles.retryButton}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
