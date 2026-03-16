'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';

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
        <Image
            src={src}
            alt={alt}
            className={className}
            width={1200}
            height={900}
            onError={() => setHasError(true)}
        />
    );
}
