'use client';

import { useEffect } from 'react';
import { recordListingView } from '@/lib/api';

export default function ViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        if (!slug) return;

        const getViewedListings = () => {
            try {
                const stored = localStorage.getItem('viewed_listings');
                return stored ? JSON.parse(stored) : {};
            } catch (e) {
                return {};
            }
        };

        const viewed = getViewedListings();
        const now = new Date().getTime();
        const expirationTime = 1000 * 60 * 60 * 12; // 12 hours timeout per listing per browser

        if (!viewed[slug] || (now - viewed[slug] > expirationTime)) {
            // Record view
            recordListingView(slug).catch(console.error);

            // Update storage
            viewed[slug] = now;
            try {
                localStorage.setItem('viewed_listings', JSON.stringify(viewed));
            } catch (e) {
                // Ignore Safari private mode quota errors
            }
        }
    }, [slug]);

    return null; // This component renders nothing
}
