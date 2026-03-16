'use client';

import { useReportWebVitals } from 'next/web-vitals';

const WEB_VITALS_ENDPOINT = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT;

const VITAL_THRESHOLDS: Record<string, number> = {
    LCP: 2500,
    INP: 200,
    FID: 100,
    CLS: 0.1,
    TTFB: 800,
};

export default function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        const payload = {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
            page: typeof window !== 'undefined' ? window.location.pathname : '',
            ts: Date.now(),
        };

        const threshold = VITAL_THRESHOLDS[metric.name];
        if (typeof threshold === 'number' && metric.value > threshold) {
            console.warn('[WebVitals] budget exceeded', payload);
        }

        if (!WEB_VITALS_ENDPOINT) {
            return;
        }

        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
            navigator.sendBeacon(WEB_VITALS_ENDPOINT, body);
            return;
        }

        fetch(WEB_VITALS_ENDPOINT, {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body,
        }).catch(() => {
            // Ignore telemetry transport failures.
        });
    });

    return null;
}
