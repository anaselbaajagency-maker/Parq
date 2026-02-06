'use client';

import { useEffect } from 'react';
import { recordListingView } from '@/lib/api';

export default function ViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        if (slug) {
            recordListingView(slug);
        }
    }, [slug]);

    return null; // This component renders nothing
}
