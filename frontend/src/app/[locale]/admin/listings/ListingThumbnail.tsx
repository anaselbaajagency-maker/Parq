'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';

interface ListingThumbnailProps {
    src?: string | null;
    alt: string;
    className: string;
}

export default function ListingThumbnail({ src, alt, className }: ListingThumbnailProps) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 ${className}`}>
                <Package size={32} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
}
