export interface WebVitalsMetric {
    id: string;
    name: string;
    startTime: number;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
}

export function useReportWebVitals(_onReport: (metric: WebVitalsMetric) => void): void {
    // No-op in SPA compatibility mode.
}
